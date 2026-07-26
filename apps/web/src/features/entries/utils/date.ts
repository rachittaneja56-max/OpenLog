export function formatEntryDate(date: string, timezone: string): string {
  const parsedDate = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    dateStyle: 'medium',
  }).format(parsedDate);
}
