import type { Response } from 'express';
import { env } from '../../config/env';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const OWNER_COOKIE_PREFIX = 'openlog_owner_';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getOwnerCookieName(trackerId: string): string {
  return `${OWNER_COOKIE_PREFIX}${trackerId}`;
}

export function getOwnerTrackerIds(cookies: Readonly<Record<string, unknown>>): string[] {
  return Object.keys(cookies)
    .filter((name) => name.startsWith(OWNER_COOKIE_PREFIX))
    .map((name) => name.slice(OWNER_COOKIE_PREFIX.length))
    .filter((trackerId) => UUID_PATTERN.test(trackerId));
}

export function getOwnerCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_YEAR_MS,
  };
}

export function setOwnerCookie(response: Response, trackerId: string, token: string): void {
  response.cookie(getOwnerCookieName(trackerId), token, getOwnerCookieOptions());
}
