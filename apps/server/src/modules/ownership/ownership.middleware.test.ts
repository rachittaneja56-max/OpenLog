import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';

vi.mock('../auth/auth.service', () => ({
  getAuthenticatedUser: vi.fn(),
}));
vi.mock('./ownership.service', () => ({
  getTrackerAccess: vi.fn(),
}));

import { getAuthenticatedUser } from '../auth/auth.service';
import { getTrackerAccess } from './ownership.service';
import { requireOwnership } from './ownership.middleware';

function createRequest(): Request {
  return {
    cookies: {},
    params: { slug: 'system-design-a1b2' },
  } as unknown as Request;
}

function createResponse(): Response {
  return { locals: {} } as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('requireOwnership', () => {
  it('rejects an anonymous mutation with 401', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(undefined);
    const next = vi.fn() as unknown as NextFunction;

    await requireOwnership(createRequest(), createResponse(), next);

    const error = vi.mocked(next).mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({
      statusCode: 401,
      code: ERROR_CODES.AUTHENTICATION_REQUIRED,
    });
  });

  it('rejects a signed-in non-owner with 403', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue({
      id: 'bc9e1203-300f-42ac-8c9d-003ad5428ef9',
      username: 'learner',
    });
    vi.mocked(getTrackerAccess).mockResolvedValue({
      isOwner: false,
      requiresLogin: false,
      canClaim: false,
    });
    const next = vi.fn() as unknown as NextFunction;

    await requireOwnership(createRequest(), createResponse(), next);

    const error = vi.mocked(next).mock.calls[0]?.[0];
    expect(error).toMatchObject({ statusCode: 403, code: ERROR_CODES.FORBIDDEN });
  });

  it('passes the authenticated owner to the protected controller', async () => {
    const user = {
      id: 'bc9e1203-300f-42ac-8c9d-003ad5428ef9',
      username: 'learner',
    };
    vi.mocked(getAuthenticatedUser).mockResolvedValue(user);
    vi.mocked(getTrackerAccess).mockResolvedValue({
      isOwner: true,
      requiresLogin: false,
      canClaim: false,
    });
    const response = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    await requireOwnership(createRequest(), response, next);

    expect(response.locals.authUser).toEqual(user);
    expect(next).toHaveBeenCalledWith();
  });
});
