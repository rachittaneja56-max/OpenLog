import type { NormalizedTrackerCreationInput } from '@openlog/shared';

export type PublicTracker = {
  id: string;
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  entries: never[];
  stats: {
    currentStreak: 0;
    longestStreak: 0;
    totalActiveDays: 0;
    totalMinutes: 0;
  };
};

export type CreateTrackerResult = {
  tracker: PublicTracker;
  publicPath: string;
  dashboardPath: string;
  ownerToken: string;
};

export type TrackerRouteLocals = {
  trackerInput?: NormalizedTrackerCreationInput;
  slug?: string;
};
