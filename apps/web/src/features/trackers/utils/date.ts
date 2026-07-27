export function formatTrackerCreatedDate(createdAt: string, timezone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    dateStyle: 'medium',
  }).format(new Date(createdAt));
}
