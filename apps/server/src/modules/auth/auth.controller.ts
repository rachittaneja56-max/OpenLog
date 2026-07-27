import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES, type ApiResponse } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { clearSessionCookie, setSessionCookie } from './session-cookie';
import {
  authenticateUser,
  claimLegacyTracker,
  createSessionForUser,
  createUserAndSession,
  invalidateSession,
} from './auth.service';
import type { AuthRouteLocals, AuthSessionResponse, AuthUserResponse } from './auth.types';

type AuthResponse = ApiResponse<{ user: AuthUserResponse }>;
type ClaimResponse = ApiResponse<{
  user: AuthUserResponse;
  publicPath: string;
  dashboardPath: string;
}>;

export async function loginController(
  _request: Request,
  response: Response<AuthResponse, AuthRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const input = response.locals.authInput;
    if (!input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid sign-in input.'));
      return;
    }

    const user = await authenticateUser(input);
    const sessionToken = await createSessionForUser(user.id);
    setSessionCookie(response, sessionToken);
    response.json({ success: true, data: { user: { username: user.username } } });
  } catch (error: unknown) {
    next(error);
  }
}

export async function registerController(
  _request: Request,
  response: Response<AuthResponse, AuthRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const input = response.locals.authInput;
    if (!input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid account input.'));
      return;
    }

    const account = await createUserAndSession(input);
    setSessionCookie(response, account.sessionToken);
    response.status(201).json({
      success: true,
      data: { user: { username: account.user.username } },
    });
  } catch (error: unknown) {
    next(error);
  }
}

export async function logoutController(
  request: Request,
  response: Response<void, AuthRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    await invalidateSession(request.cookies ?? {});
    clearSessionCookie(response);
    response.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
}

export async function meController(
  _request: Request,
  response: Response<ApiResponse<AuthSessionResponse>, AuthRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const user = response.locals.authUser;
    if (!user) {
      response.json({
        success: true,
        data: { authenticated: false, user: null },
      });
      return;
    }

    response.json({
      success: true,
      data: { authenticated: true, user: { username: user.username } },
    });
  } catch (error: unknown) {
    next(error);
  }
}

export async function claimTrackerController(
  request: Request,
  response: Response<ClaimResponse, AuthRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const input = response.locals.claimInput;
    if (!input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid claim input.'));
      return;
    }

    const credentials =
      input.username && input.password
        ? { username: input.username, password: input.password }
        : undefined;
    const result = await claimLegacyTracker(
      input.slug,
      request.cookies ?? {},
      credentials,
      response.locals.authUser?.id
    );

    if (result.sessionToken) setSessionCookie(response, result.sessionToken);
    response.json({
      success: true,
      data: {
        user: { username: result.user.username },
        publicPath: '/learn/' + input.slug,
        dashboardPath: '/dashboard/' + input.slug,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
}
