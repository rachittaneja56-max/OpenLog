import { addCalendarDays, getDayOfWeek, getMonthKey } from './date-utils';
import type { ActivityDay, ActivityLevel, ActivityMonthLabel, StreakEntry } from './types';

export const DEFAULT_ACTIVITY_DAYS = 84;

function getActivityLevel(count: number, minutes: number): ActivityLevel {
  if (count === 0) return 0;
  if (minutes === 0 || minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 120) return 3;
  return 4;
}

export function buildActivityDays(
  entries: readonly StreakEntry[],
  today: string,
  dayCount = DEFAULT_ACTIVITY_DAYS
): ActivityDay[] {
  if (!Number.isInteger(dayCount) || dayCount < 1) {
    throw new RangeError('Activity day count must be a positive integer.');
  }

  const activityByDate = new Map<string, { count: number; minutes: number }>();
  for (const entry of entries) {
    const current = activityByDate.get(entry.entryDate) ?? { count: 0, minutes: 0 };
    activityByDate.set(entry.entryDate, {
      count: current.count + 1,
      minutes: current.minutes + (entry.minutesSpent ?? 0),
    });
  }

  const currentWeekEnd = addCalendarDays(today, 6 - getDayOfWeek(today));
  const startDate = addCalendarDays(currentWeekEnd, -(dayCount - 1));
  return Array.from({ length: dayCount }, (_, index) => {
    const date = addCalendarDays(startDate, index);
    const activity = activityByDate.get(date) ?? { count: 0, minutes: 0 };
    return {
      date,
      count: activity.count,
      level: getActivityLevel(activity.count, activity.minutes),
    };
  });
}

const monthNames = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;

export function buildActivityMonthLabels(days: readonly ActivityDay[]): ActivityMonthLabel[] {
  const labels: ActivityMonthLabel[] = [];
  let previousMonth: string | null = null;

  for (const day of days) {
    const monthKey = getMonthKey(day.date);
    if (monthKey === previousMonth) continue;
    previousMonth = monthKey;
    const monthIndex = Number(monthKey.slice(5, 7)) - 1;
    labels.push({
      key: monthKey,
      label: monthNames[monthIndex],
      weekIndex: Math.floor(days.indexOf(day) / 7),
    });
  }
  return labels;
}
