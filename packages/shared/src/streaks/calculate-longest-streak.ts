import { calendarDateDistance, getDistinctSortedDates } from './date-utils';

export function calculateLongestStreak(entryDates: readonly string[]): number {
  const dates = getDistinctSortedDates(entryDates);
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let index = 1; index < dates.length; index += 1) {
    if (calendarDateDistance(dates[index - 1], dates[index]) === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}
