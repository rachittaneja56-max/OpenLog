import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiResponse } from '@openlog/shared';
import type { AuthRouteLocals, AuthSessionResponse } from './auth.types';

vi.mock('./auth.service', () => ({
  authenticateUser: vi.fn(),
  claimLegacyTracker: vi.fn(),
  claimLegacyTrackersForUser: vi.fn(),
  createSessionForUser: vi.fn(),
  createUserAndSession: vi.fn(),
  invalidateSession: vi.fn(),
}));
vi.mock('./session-cookie', () => ({
  clearSessionCookie: vi.fn(),
  setSessionCookie: vi.fn(),
}));

import { claimLegacyTrackersForUser } from './auth.service';
import { meController } from './auth.controller';

function createResponse(
  locals: AuthRouteLocals
): Response<ApiResponse<AuthSessionResponse>, AuthRouteLocals> {
  return {
    locals,
    json: vi.fn(),
    setHeader: vi.fn(),
  } as unknown as Response<ApiResponse<AuthSessionResponse>, AuthRouteLocals>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('meController', () => {
  it('restores the session and attaches browser-owned legacy trackers first', async () => {
    const request = {
      cookies: { openlog_owner_tracker: 'owner-token' },
    } as unknown as Request;
    const response = createResponse({
      authUser: {
        id: 'bc9e1203-300f-42ac-8c9d-003ad5428ef9',
        username: 'learner',
      },
    });
    const next = vi.fn();

    await meController(request, response, next as NextFunction);

    expect(claimLegacyTrackersForUser).toHaveBeenCalledWith(
      request.cookies,
      response.locals.authUser?.id
    );
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: { authenticated: true, user: { username: 'learner' } },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('keeps anonymous session checks anonymous without attempting a claim', async () => {
    const request = { cookies: {} } as unknown as Request;
    const response = createResponse({});
    const next = vi.fn();

    await meController(request, response, next as NextFunction);

    expect(claimLegacyTrackersForUser).not.toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: { authenticated: false, user: null },
    });
  });
});
