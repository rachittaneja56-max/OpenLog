function readDateParts(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  return parts.reduce<Record<string, string>>((result, part) => {
    if (part.type !== 'literal') result[part.type] = part.value;
    return result;
  }, {});
}

export function getCalendarDateInTimezone(timezone: string, date: Date = new Date()): string {
  const parts = readDateParts(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date)
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function addCalendarDays(date: string, amount: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const result = new Date(Date.UTC(year, month - 1, day + amount));
  const resultYear = result.getUTCFullYear();
  const resultMonth = String(result.getUTCMonth() + 1).padStart(2, '0');
  const resultDay = String(result.getUTCDate()).padStart(2, '0');
  return `${resultYear}-${resultMonth}-${resultDay}`;
}

export function calendarDateDistance(first: string, second: string): number {
  const [firstYear, firstMonth, firstDay] = first.split('-').map(Number);
  const [secondYear, secondMonth, secondDay] = second.split('-').map(Number);
  const firstTime = Date.UTC(firstYear, firstMonth - 1, firstDay);
  const secondTime = Date.UTC(secondYear, secondMonth - 1, secondDay);
  return Math.round(Math.abs(firstTime - secondTime) / 86_400_000);
}
