import type { ActivityDay, NormalizedTrackerCreationInput, StreakStats } from '@openlog/shared';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { PublicEntry } from '../entries/entry.types';

export type PublicTracker = {
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  createdAt: string;
  entries: PublicEntry[];
  stats: StreakStats;
  heatmap: ActivityDay[];
};

export type CreateTrackerResult = {
  tracker: PublicTracker;
  trackerId: string;
  publicPath: string;
  dashboardPath: string;
  ownerToken: string;
};

export type TrackerRouteLocals = {
  trackerInput?: NormalizedTrackerCreationInput;
  slug?: string;
  authUser?: AuthenticatedUser;
};
