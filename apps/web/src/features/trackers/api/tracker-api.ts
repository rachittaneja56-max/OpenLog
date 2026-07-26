import { apiRequest } from '../../../lib/api-client';

export type TrackerStats = {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalMinutes: number;
};

export type TrackerEntry = {
  id: string;
  entryDate: string;
  learned: string;
  confusedAbout: string | null;
  nextStep: string | null;
  minutesSpent: number | null;
  resourceUrl: string | null;
};

export type PublicTracker = {
  id: string;
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  stats: TrackerStats;
  entries: TrackerEntry[];
};

export type CreateTrackerInput = {
  slug: string;
  displayName?: string;
  topic: string;
  description?: string;
  timezone: string;
};

export type CreatedTracker = {
  tracker: PublicTracker;
  publicUrl: string;
};

export type OwnerAccess = {
  trackerId: string;
  hasAccess: boolean;
};

export async function createTracker(
  input: CreateTrackerInput,
  signal?: AbortSignal
): Promise<CreatedTracker> {
  return apiRequest<CreatedTracker>('/trackers', {
    method: 'POST',
    body: input,
    signal,
  });
}

export async function getPublicTracker(slug: string, signal?: AbortSignal): Promise<PublicTracker> {
  return apiRequest<PublicTracker>(`/trackers/${encodeURIComponent(slug)}`, { signal });
}

export async function getOwnerAccess(slug: string, signal?: AbortSignal): Promise<OwnerAccess> {
  return apiRequest<OwnerAccess>(`/trackers/${encodeURIComponent(slug)}/owner-access`, { signal });
}
