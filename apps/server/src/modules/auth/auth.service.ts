import { createHash, randomBytes } from 'node:crypto';
import { ERROR_CODES, type NormalizedAuthCredentials } from '@openlog/shared';
import { db, type DatabaseExecutor } from '../../database/client';
import { HttpError } from '../../errors/http-error';
import {
  deleteSession,
  findSessionByTokenHash,
  insertSession,
  updateSessionUsage,
} from '../../repositories/session.repository';
import { findTrackerBySlug, linkTrackerToUser } from '../../repositories/tracker.repository';
import { findUserById, findUserByUsername, insertUser } from '../../repositories/user.repository';
import { checkOwnership } from '../ownership/ownership.service';
import type { OwnerCookieSource } from '../ownership/ownership.types';
import { getSessionCookieValue, getSessionExpiry } from './session-cookie';
import { hashPassword, verifyPassword } from './password';
import type { AuthenticatedUser } from './auth.types';

type UserSession = {
  user: AuthenticatedUser;
  sessionToken: string;
};

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return (error as { code?: unknown }).code === '23505';
}

function toAuthenticatedUser(user: { id: string; username: string }): AuthenticatedUser {
  return { id: user.id, username: user.username };
}

export async function createUserAndSession(
  input: NormalizedAuthCredentials,
  database: DatabaseExecutor = db
): Promise<UserSession> {
  const existing = await findUserByUsername(input.username, database);
  if (existing) {
    throw new HttpError(409, ERROR_CODES.USERNAME_TAKEN, 'That username is already in use.');
  }

  try {
    const passwordHash = await hashPassword(input.password);
    const user = await insertUser(
      {
        username: input.username,
        passwordHash,
      },
      database
    );
    const sessionToken = createSessionToken();
    await insertSession(
      {
        userId: user.id,
        tokenHash: hashSessionToken(sessionToken),
        expiresAt: getSessionExpiry(),
      },
      database
    );

    return {
      user: toAuthenticatedUser(user),
      sessionToken,
    };
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      throw new HttpError(409, ERROR_CODES.USERNAME_TAKEN, 'That username is already in use.');
    }
    throw error;
  }
}

export async function createSessionForUser(userId: string): Promise<string> {
  const sessionToken = createSessionToken();
  await insertSession({
    userId,
    tokenHash: hashSessionToken(sessionToken),
    expiresAt: getSessionExpiry(),
  });
  return sessionToken;
}

export async function authenticateUser(
  input: NormalizedAuthCredentials
): Promise<AuthenticatedUser> {
  const user = await findUserByUsername(input.username);
  const valid = user ? await verifyPassword(user.passwordHash, input.password) : false;
  if (!user || !valid) {
    throw new HttpError(401, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid username or password.');
  }

  return toAuthenticatedUser(user);
}

export async function getAuthenticatedUser(
  cookies: OwnerCookieSource
): Promise<AuthenticatedUser | undefined> {
  const token = getSessionCookieValue(cookies);
  if (!token) return undefined;

  const session = await findSessionByTokenHash(hashSessionToken(token));
  if (!session) return undefined;

  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSession(session.id);
    return undefined;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    await deleteSession(session.id);
    return undefined;
  }

  await updateSessionUsage(session.id, new Date());
  return toAuthenticatedUser(user);
}

export async function invalidateSession(cookies: OwnerCookieSource): Promise<void> {
  const token = getSessionCookieValue(cookies);
  if (!token) return;
  const session = await findSessionByTokenHash(hashSessionToken(token));
  if (session) await deleteSession(session.id);
}

export async function claimLegacyTracker(
  slug: string,
  cookies: OwnerCookieSource,
  credentials: NormalizedAuthCredentials | undefined,
  authenticatedUserId: string | undefined
): Promise<UserSession | { user: AuthenticatedUser; sessionToken?: undefined }> {
  const legacyOwnership = await checkOwnership(slug, cookies);
  if (!legacyOwnership.isOwner) {
    throw new HttpError(403, ERROR_CODES.CLAIM_NOT_AVAILABLE, 'This log cannot be claimed.');
  }

  const tracker = await findTrackerBySlug(slug);
  if (!tracker || tracker.ownerUserId !== null) {
    throw new HttpError(403, ERROR_CODES.CLAIM_NOT_AVAILABLE, 'This log cannot be claimed.');
  }

  return db.transaction(async (transaction) => {
    const account = authenticatedUserId
      ? { user: await getAuthenticatedUserById(authenticatedUserId), sessionToken: undefined }
      : credentials
        ? await createUserAndSession(credentials, transaction)
        : undefined;

    if (!account) {
      throw new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Account details are required to claim this log.',
        {
          username: ['Username is required.'],
          password: ['Password is required.'],
        }
      );
    }

    const linkedTracker = await linkTrackerToUser(tracker.id, account.user.id, transaction);
    if (!linkedTracker) {
      throw new HttpError(403, ERROR_CODES.CLAIM_NOT_AVAILABLE, 'This log cannot be claimed.');
    }

    return account;
  });
}

async function getAuthenticatedUserById(userId: string): Promise<AuthenticatedUser> {
  const user = await findUserById(userId);
  if (!user) {
    throw new HttpError(401, ERROR_CODES.AUTHENTICATION_REQUIRED, 'Sign in to continue.');
  }
  return toAuthenticatedUser(user);
}
