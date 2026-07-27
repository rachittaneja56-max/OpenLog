import type { StreakStats } from '@openlog/shared';
import { apiRequest } from '../../../lib/api-client';

export type OwnedTrackerSummary = {
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  createdAt: string;
  stats: StreakStats;
};

export async function getOwnedTrackers(signal?: AbortSignal): Promise<OwnedTrackerSummary[]> {
  return apiRequest<OwnedTrackerSummary[]>('/me/trackers', { signal });
}
