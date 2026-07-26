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
