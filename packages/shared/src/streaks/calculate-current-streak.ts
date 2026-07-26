import { addCalendarDays, getDistinctSortedDates } from './date-utils';

export function calculateCurrentStreak(entryDates: readonly string[], today: string): number {
  const dates = new Set(getDistinctSortedDates(entryDates));
  const yesterday = addCalendarDays(today, -1);
  let cursor: string;

  if (dates.has(today)) cursor = today;
  else if (dates.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addCalendarDays(cursor, -1);
  }
  return streak;
}
