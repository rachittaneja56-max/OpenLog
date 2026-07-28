export function getSafeReturnPath(search: string): string {
  const returnTo = new URLSearchParams(search).get('returnTo');
  if (!returnTo || !returnTo.startsWith('/') || returnTo.startsWith('//')) return '/history';
  if (returnTo === '/login' || returnTo.startsWith('/login?')) return '/history';
  return returnTo;
}
