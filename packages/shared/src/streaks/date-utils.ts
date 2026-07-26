const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertCalendarDate(date: string): string {
  if (!CALENDAR_DATE_PATTERN.test(date)) throw new RangeError(`Invalid calendar date: ${date}`);
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid calendar date: ${date}`);
  }
  return date;
}

export function addCalendarDays(date: string, amount: number): string {
  assertCalendarDate(date);
  if (!Number.isInteger(amount)) throw new RangeError('Calendar-day offset must be an integer.');
  const [year, month, day] = date.split('-').map(Number);
  const result = new Date(Date.UTC(year, month - 1, day + amount));
  const resultYear = result.getUTCFullYear();
  const resultMonth = String(result.getUTCMonth() + 1).padStart(2, '0');
  const resultDay = String(result.getUTCDate()).padStart(2, '0');
  return `${resultYear}-${resultMonth}-${resultDay}`;
}

export function compareCalendarDates(first: string, second: string): number {
  assertCalendarDate(first);
  assertCalendarDate(second);
  return first < second ? -1 : first > second ? 1 : 0;
}

export function getDistinctSortedDates(dates: readonly string[]): string[] {
  return Array.from(new Set(dates.map(assertCalendarDate))).sort(compareCalendarDates);
}

export function calendarDateDistance(first: string, second: string): number {
  assertCalendarDate(first);
  assertCalendarDate(second);
  const [firstYear, firstMonth, firstDay] = first.split('-').map(Number);
  const [secondYear, secondMonth, secondDay] = second.split('-').map(Number);
  const firstTime = Date.UTC(firstYear, firstMonth - 1, firstDay);
  const secondTime = Date.UTC(secondYear, secondMonth - 1, secondDay);
  return Math.round(Math.abs(firstTime - secondTime) / 86_400_000);
}

export function getMonthKey(date: string): string {
  assertCalendarDate(date);
  return date.slice(0, 7);
}

export function getDayOfWeek(date: string): number {
  assertCalendarDate(date);
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
