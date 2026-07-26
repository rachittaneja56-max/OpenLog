import { createHash, randomBytes } from 'node:crypto';
import { db } from '../../database/client';
import { insertOwnerAccess } from '../../repositories/owner-access.repository';
import {
  checkSlugExists,
  findTrackerBySlug,
  insertTracker,
} from '../../repositories/tracker.repository';
import type { NormalizedTrackerCreationInput } from '@openlog/shared';
import type { CreateTrackerResult, PublicTracker } from './tracker.types';

const MAX_SLUG_ATTEMPTS = 5;

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

function toPublicTracker(tracker: {
  id: string;
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
}): PublicTracker {
  return {
    id: tracker.id,
    slug: tracker.slug,
    displayName: tracker.displayName,
    topic: tracker.topic,
    description: tracker.description,
    timezone: tracker.timezone,
    entries: [],
    stats: {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      totalMinutes: 0,
    },
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

      const publicTracker = toPublicTracker(tracker);
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
  return tracker ? toPublicTracker(tracker) : undefined;
}
