import type { NormalizedAuthCredentials } from '@openlog/shared';

export type AuthenticatedUser = {
  id: string;
  username: string;
};

export type AuthRouteLocals = {
  authInput?: NormalizedAuthCredentials;
  claimInput?: {
    slug: string;
    username?: string;
    password?: string;
  };
  authUser?: AuthenticatedUser;
};

export type AuthUserResponse = {
  username: string;
};

export type AuthSessionResponse =
  { authenticated: false; user: null } | { authenticated: true; user: AuthUserResponse };
