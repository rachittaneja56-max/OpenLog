import { calculateCurrentStreak } from './calculate-current-streak';
import { calculateLongestStreak } from './calculate-longest-streak';
import { getDistinctSortedDates } from './date-utils';
import type { StreakEntry, StreakStats } from './types';

export function calculateStreakStats(entries: readonly StreakEntry[], today: string): StreakStats {
  const entryDates = entries.map((entry) => entry.entryDate);
  const distinctDates = getDistinctSortedDates(entryDates);
  const latestEntryDate = distinctDates.at(-1) ?? null;

  return {
    currentStreak: calculateCurrentStreak(entryDates, today),
    longestStreak: calculateLongestStreak(entryDates),
    totalActiveDays: distinctDates.length,
    totalEntries: entries.length,
    totalMinutes: entries.reduce((total, entry) => total + (entry.minutesSpent ?? 0), 0),
    hasLoggedToday: distinctDates.includes(today),
    latestEntryDate,
  };
}
