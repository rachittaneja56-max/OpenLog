import { createHash, randomBytes } from 'node:crypto';
import type { Entry } from '../../database/schema/entries';
import { db } from '../../database/client';
import { insertOwnerAccess } from '../../repositories/owner-access.repository';
import { findEntriesByTracker } from '../../repositories/entry.repository';
import {
  checkSlugExists,
  findTrackerBySlug,
  insertTracker,
} from '../../repositories/tracker.repository';
import type { NormalizedTrackerCreationInput } from '@openlog/shared';
import {
  addCalendarDays,
  calendarDateDistance,
  getCalendarDateInTimezone,
} from '../../utils/calendar';
import { toPublicEntry } from '../entries/entry.service';
import type { ActivityDay, PublicEntry } from '../entries/entry.types';
import type { CreateTrackerResult, PublicTracker } from './tracker.types';

const MAX_SLUG_ATTEMPTS = 5;
const HEATMAP_DAYS = 84;

function createSlugBase(input: NormalizedTrackerCreationInput): string {
  const source = input.displayName ?? input.topic;
  const base = source
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56);

  return base || 'learning-log';
}

function createSlug(input: NormalizedTrackerCreationInput): string {
  const suffix = randomBytes(3)
    .toString('base64url')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, '0');
  return `${createSlugBase(input)}-${suffix}`;
}

function createOwnerToken(): string {
  return randomBytes(32).toString('base64url');
}

function hashOwnerToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function calculateStats(entries: Entry[], today: string): PublicTracker['stats'] {
  const dates = entries.map((entry) => entry.entryDate).sort();
  const dateSet = new Set(dates);
  let currentStreak = 0;
  let cursor = today;

  while (dateSet.has(cursor)) {
    currentStreak += 1;
    cursor = addCalendarDays(cursor, -1);
  }

  let longestStreak = dates.length > 0 ? 1 : 0;
  let run = 1;
  for (let index = 1; index < dates.length; index += 1) {
    if (calendarDateDistance(dates[index - 1], dates[index]) === 1) {
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 1;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays: entries.length,
    totalMinutes: entries.reduce((total, entry) => total + (entry.minutesSpent ?? 0), 0),
  };
}

function buildHeatmap(entries: Entry[], today: string): ActivityDay[] {
  const entriesByDate = new Map(entries.map((entry) => [entry.entryDate, entry]));
  const startDate = addCalendarDays(today, -(HEATMAP_DAYS - 1));
  return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const date = addCalendarDays(startDate, index);
    const entry = entriesByDate.get(date);
    return {
      date,
      active: entry !== undefined,
      minutesSpent: entry?.minutesSpent ?? null,
    };
  });
}

function toPublicTracker(
  tracker: {
    id: string;
    slug: string;
    displayName: string | null;
    topic: string;
    description: string | null;
    timezone: string;
    createdAt: Date;
  },
  entries: Entry[]
): PublicTracker {
  const today = getCalendarDateInTimezone(tracker.timezone);
  const publicEntries: PublicEntry[] = entries.map(toPublicEntry);
  return {
    id: tracker.id,
    slug: tracker.slug,
    displayName: tracker.displayName,
    topic: tracker.topic,
    description: tracker.description,
    timezone: tracker.timezone,
    createdAt: tracker.createdAt.toISOString(),
    entries: publicEntries,
    stats: calculateStats(entries, today),
    heatmap: buildHeatmap(entries, today),
  };
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return (error as { code?: unknown }).code === '23505';
}

export async function createTracker(
  input: NormalizedTrackerCreationInput
): Promise<CreateTrackerResult> {
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    const slug = createSlug(input);
    if (await checkSlugExists(slug)) continue;

    const ownerToken = createOwnerToken();
    const tokenHash = hashOwnerToken(ownerToken);

    try {
      const tracker = await db.transaction(async (transaction) => {
        const createdTracker = await insertTracker(
          {
            slug,
            displayName: input.displayName ?? null,
            topic: input.topic,
            description: input.description ?? null,
            timezone: input.timezone,
          },
          transaction
        );

        await insertOwnerAccess(
          {
            trackerId: createdTracker.id,
            tokenHash,
          },
          transaction
        );

        return createdTracker;
      });

      const publicTracker = toPublicTracker(tracker, []);
      return {
        tracker: publicTracker,
        publicPath: `/learn/${slug}`,
        dashboardPath: `/dashboard/${slug}`,
        ownerToken,
      };
    } catch (error: unknown) {
      if (isUniqueViolation(error)) continue;
      throw error;
    }
  }

  throw new Error('Could not allocate a unique tracker slug.');
}

export async function getPublicTracker(slug: string): Promise<PublicTracker | undefined> {
  const tracker = await findTrackerBySlug(slug);
  if (!tracker) return undefined;
  const entries = await findEntriesByTracker(tracker.id);
  return toPublicTracker(tracker, entries);
}
