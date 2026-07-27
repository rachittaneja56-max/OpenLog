import { ERROR_CODES, type EntryCreationInput, type EntryUpdateInput } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import {
  deleteEntry as deleteEntryRecord,
  findEntryById,
  findEntryByTrackerAndDate,
  insertEntry,
  updateEntry as updateEntryRecord,
} from '../../repositories/entry.repository';
import { findTrackerBySlug } from '../../repositories/tracker.repository';
import { getCalendarDateInTimezone } from '../../utils/calendar';
import { getTrackerAccess } from '../ownership/ownership.service';
import type { OwnerCookieSource } from '../ownership/ownership.types';
import type { PublicEntry } from './entry.types';

function assertUniqueEntry(error: unknown): void {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (code === '23505') {
      throw new HttpError(
        409,
        ERROR_CODES.ENTRY_ALREADY_EXISTS,
        'An entry already exists for today.'
      );
    }
  }
}

function requireOwner(): never {
  throw new HttpError(403, ERROR_CODES.FORBIDDEN, 'Owner access required.');
}

async function loadOwnedTracker(
  slug: string,
  cookies: OwnerCookieSource,
  userId: string | undefined
): Promise<NonNullable<Awaited<ReturnType<typeof findTrackerBySlug>>>> {
  const ownership = await getTrackerAccess(slug, cookies, userId);
  if (!ownership.isOwner) requireOwner();

  const tracker = await findTrackerBySlug(slug);
  if (!tracker) throw new HttpError(404, ERROR_CODES.NOT_FOUND, 'Tracker not found.');
  return tracker;
}

export function toPublicEntry(entry: {
  id: string;
  entryDate: string;
  learned: string;
  confusedAbout: string | null;
  nextStep: string | null;
  minutesSpent: number | null;
  resourceUrl: string | null;
}): PublicEntry {
  return {
    id: entry.id,
    entryDate: entry.entryDate,
    learned: entry.learned,
    confusedAbout: entry.confusedAbout,
    nextStep: entry.nextStep,
    minutesSpent: entry.minutesSpent,
    resourceUrl: entry.resourceUrl,
  };
}

export async function createEntry(
  slug: string,
  input: EntryCreationInput,
  cookies: OwnerCookieSource,
  userId: string | undefined
): Promise<PublicEntry> {
  const tracker = await loadOwnedTracker(slug, cookies, userId);
  const entryDate = getCalendarDateInTimezone(tracker.timezone);
  const existingEntry = await findEntryByTrackerAndDate(tracker.id, entryDate);
  if (existingEntry) {
    throw new HttpError(
      409,
      ERROR_CODES.ENTRY_ALREADY_EXISTS,
      'An entry already exists for today.'
    );
  }

  try {
    const entry = await insertEntry({
      trackerId: tracker.id,
      entryDate,
      learned: input.learned,
      confusedAbout: input.confusedAbout ?? null,
      nextStep: input.nextStep ?? null,
      minutesSpent: input.minutesSpent ?? null,
      resourceUrl: input.resourceUrl ?? null,
    });
    return toPublicEntry(entry);
  } catch (error: unknown) {
    assertUniqueEntry(error);
    throw error;
  }
}

export async function updateEntry(
  slug: string,
  entryId: string,
  input: EntryUpdateInput,
  cookies: OwnerCookieSource,
  userId: string | undefined
): Promise<PublicEntry> {
  const tracker = await loadOwnedTracker(slug, cookies, userId);
  const existingEntry = await findEntryById(entryId);
  if (!existingEntry || existingEntry.trackerId !== tracker.id) {
    throw new HttpError(404, ERROR_CODES.NOT_FOUND, 'Entry not found.');
  }

  const entry = await updateEntryRecord(entryId, input);
  if (!entry) throw new HttpError(404, ERROR_CODES.NOT_FOUND, 'Entry not found.');
  return toPublicEntry(entry);
}

export async function deleteEntry(
  slug: string,
  entryId: string,
  cookies: OwnerCookieSource,
  userId: string | undefined
): Promise<void> {
  const tracker = await loadOwnedTracker(slug, cookies, userId);
  const existingEntry = await findEntryById(entryId);
  if (!existingEntry || existingEntry.trackerId !== tracker.id) {
    throw new HttpError(404, ERROR_CODES.NOT_FOUND, 'Entry not found.');
  }

  await deleteEntryRecord(entryId);
}
