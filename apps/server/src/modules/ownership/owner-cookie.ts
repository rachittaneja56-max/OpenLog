import type { Response } from 'express';
import { env } from '../../config/env';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const OWNER_COOKIE_PREFIX = 'openlog_owner_';

export function getOwnerCookieName(trackerId: string): string {
  return `${OWNER_COOKIE_PREFIX}${trackerId}`;
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
