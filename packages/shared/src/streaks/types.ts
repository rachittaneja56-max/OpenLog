export type StreakEntry = {
  entryDate: string;
  minutesSpent?: number | null;
};

export type StreakStats = {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalEntries: number;
  totalMinutes: number;
  hasLoggedToday: boolean;
  latestEntryDate: string | null;
};

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export type ActivityDay = {
  date: string;
  count: number;
  level: ActivityLevel;
};

export type ActivityMonthLabel = {
  key: string;
  label: string;
  weekIndex: number;
};
