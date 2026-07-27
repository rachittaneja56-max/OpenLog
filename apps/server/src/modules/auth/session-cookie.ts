import type { Response } from 'express';
import { env } from '../../config/env';

const SESSION_COOKIE_NAME = 'openlog_session';
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getSessionCookieOptions(): {
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
    maxAge: SESSION_MAX_AGE_MS,
  };
}

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function getSessionCookieValue(
  cookies: Readonly<Record<string, unknown>>
): string | undefined {
  const value = cookies[SESSION_COOKIE_NAME];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_MS);
}
