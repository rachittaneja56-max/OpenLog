export function formatEntryDate(date: string): string {
  const parsedDate = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    dateStyle: 'medium',
  }).format(parsedDate);
}
