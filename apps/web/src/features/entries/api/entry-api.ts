import { apiRequest } from '../../../lib/api-client';
import type { TrackerEntry } from '../../trackers/api/tracker-api';

export type CreateEntryInput = {
  entryDate: string;
  learned: string;
  confusedAbout?: string;
  nextStep?: string;
  minutesSpent?: number;
  resourceUrl?: string;
};

export type UpdateEntryInput = Partial<CreateEntryInput>;

export async function createEntry(
  slug: string,
  input: CreateEntryInput,
  signal?: AbortSignal
): Promise<TrackerEntry> {
  return apiRequest<TrackerEntry>(`/trackers/${encodeURIComponent(slug)}/entries`, {
    method: 'POST',
    body: input,
    signal,
  });
}

export async function updateEntry(
  slug: string,
  entryId: string,
  input: UpdateEntryInput,
  signal?: AbortSignal
): Promise<TrackerEntry> {
  return apiRequest<TrackerEntry>(
    `/trackers/${encodeURIComponent(slug)}/entries/${encodeURIComponent(entryId)}`,
    { method: 'PATCH', body: input, signal }
  );
}

export async function deleteEntry(
  slug: string,
  entryId: string,
  signal?: AbortSignal
): Promise<void> {
  return apiRequest<void>(
    `/trackers/${encodeURIComponent(slug)}/entries/${encodeURIComponent(entryId)}`,
    { method: 'DELETE', signal }
  );
}
