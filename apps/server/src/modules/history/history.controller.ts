import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES, type ApiResponse } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { getOwnedTrackerSummaries } from './history.service';
import type { OwnedTrackerSummary } from './history.types';

export async function getOwnedTrackerSummariesController(
  _request: Request,
  response: Response<ApiResponse<OwnedTrackerSummary[]>>,
  next: NextFunction
): Promise<void> {
  try {
    const user = response.locals.authUser;
    if (!user) {
      next(new HttpError(401, ERROR_CODES.AUTHENTICATION_REQUIRED, 'Sign in to continue.'));
      return;
    }

    const trackers = await getOwnedTrackerSummaries(user.id);
    response.json({ success: true, data: trackers });
  } catch (error: unknown) {
    next(error);
  }
}
