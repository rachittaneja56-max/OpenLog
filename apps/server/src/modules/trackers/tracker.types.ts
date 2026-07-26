import type { NormalizedTrackerCreationInput } from '@openlog/shared';
import type { ActivityDay, PublicEntry } from '../entries/entry.types';

export type PublicTracker = {
  id: string;
  slug: string;
  displayName: string | null;
  topic: string;
  description: string | null;
  timezone: string;
  createdAt: string;
  entries: PublicEntry[];
  stats: {
    currentStreak: number;
    longestStreak: number;
    totalActiveDays: number;
    totalMinutes: number;
  };
  heatmap: ActivityDay[];
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
