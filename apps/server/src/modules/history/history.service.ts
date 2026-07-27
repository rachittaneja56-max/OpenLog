import { calculateStreakStats, type StreakEntry } from '@openlog/shared';
import { findEntriesByTracker } from '../../repositories/entry.repository';
import { findTrackersByOwnerUserId } from '../../repositories/tracker.repository';
import { getCalendarDateInTimezone } from '../../utils/calendar';
import type { OwnedTrackerSummary } from './history.types';

export async function getOwnedTrackerSummaries(userId: string): Promise<OwnedTrackerSummary[]> {
  const trackers = await findTrackersByOwnerUserId(userId);

  return Promise.all(
    trackers.map(async (tracker) => {
      const entries = await findEntriesByTracker(tracker.id);
      const streakEntries: StreakEntry[] = entries.map((entry) => ({
        entryDate: entry.entryDate,
        minutesSpent: entry.minutesSpent,
      }));

      return {
        slug: tracker.slug,
        displayName: tracker.displayName,
        topic: tracker.topic,
        description: tracker.description,
        timezone: tracker.timezone,
        createdAt: tracker.createdAt.toISOString(),
        stats: calculateStreakStats(streakEntries, getCalendarDateInTimezone(tracker.timezone)),
      };
    })
  );
}
