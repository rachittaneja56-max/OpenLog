import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { getAuthenticatedUser } from '../auth/auth.service';
import { getTrackerAccess } from './ownership.service';

export async function requireOwnership(
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

    const access = await getTrackerAccess(request.params.slug, request.cookies ?? {}, user.id);
    if (!access.isOwner) {
      next(new HttpError(403, ERROR_CODES.FORBIDDEN, 'Owner access required.'));
      return;
    }

    response.locals.authUser = user;
    next();
  } catch (error: unknown) {
    next(error);
  }
}
