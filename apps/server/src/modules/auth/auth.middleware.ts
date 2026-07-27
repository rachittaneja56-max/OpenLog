import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { getAuthenticatedUser } from './auth.service';

export async function optionalAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getAuthenticatedUser(request.cookies ?? {});
    if (user) response.locals.authUser = user;
    next();
  } catch (error: unknown) {
    next(error);
  }
}

export async function requireAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getAuthenticatedUser(request.cookies ?? {});
    if (!user) {
      next(new HttpError(401, ERROR_CODES.AUTHENTICATION_REQUIRED, 'Sign in to continue.'));
      return;
    }

    response.locals.authUser = user;
    next();
  } catch (error: unknown) {
    next(error);
  }
}
