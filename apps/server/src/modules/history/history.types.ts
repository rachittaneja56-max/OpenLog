import type { StreakStats } from '@openlog/shared';

export type OwnedTrackerSummary = {
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  createdAt: string;
  stats: StreakStats;
};
