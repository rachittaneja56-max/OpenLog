import type { AuthCredentialsInput } from '@openlog/shared';
import { apiRequest } from '../../../lib/api-client';

export type AuthenticatedSession =
  { authenticated: false; user: null } | { authenticated: true; user: { username: string } };

export type LoginResult = {
  user: {
    username: string;
  };
  claimedTrackers: number;
};

export type ClaimTrackerInput = {
  slug: string;
  username?: string;
  password?: string;
};

export type ClaimTrackerResult = {
  user: {
    username: string;
  };
  publicPath: string;
  dashboardPath: string;
};

export async function getCurrentUser(signal?: AbortSignal): Promise<AuthenticatedSession> {
  return apiRequest<AuthenticatedSession>('/auth/me', { signal, cache: 'no-store' });
}

export async function login(
  input: AuthCredentialsInput,
  signal?: AbortSignal
): Promise<LoginResult> {
  return apiRequest<LoginResult>('/auth/login', {
    method: 'POST',
    body: input,
    signal,
  });
}

export async function register(
  input: AuthCredentialsInput,
  signal?: AbortSignal
): Promise<LoginResult> {
  return apiRequest<LoginResult>('/auth/register', {
    method: 'POST',
    body: input,
    signal,
  });
}

export async function logout(signal?: AbortSignal): Promise<void> {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
    signal,
  });
}

export async function claimTracker(
  input: ClaimTrackerInput,
  signal?: AbortSignal
): Promise<ClaimTrackerResult> {
  return apiRequest<ClaimTrackerResult>('/auth/claim', {
    method: 'POST',
    body: input,
    signal,
  });
}
