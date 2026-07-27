import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES, type ApiResponse } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { setOwnerCookie } from '../ownership/owner-cookie';
import { getTrackerAccess } from '../ownership/ownership.service';
import { createTracker, getPublicTracker } from './tracker.service';
import type { CreateTrackerResult, PublicTracker, TrackerRouteLocals } from './tracker.types';

export type CreateTrackerResponse = {
  tracker: PublicTracker;
  publicPath: string;
  dashboardPath: string;
};

type OwnershipResponse = {
  isOwner: boolean;
  requiresLogin: boolean;
  canClaim: boolean;
};

export async function createTrackerController(
  _request: Request,
  response: Response<ApiResponse<CreateTrackerResponse>, TrackerRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const input = response.locals.trackerInput;
    if (!input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid tracker input.'));
      return;
    }

    const result: CreateTrackerResult = await createTracker(input, response.locals.authUser?.id);
    setOwnerCookie(response, result.trackerId, result.ownerToken);

    response.status(201).json({
      success: true,
      data: {
        tracker: result.tracker,
        publicPath: result.publicPath,
        dashboardPath: result.dashboardPath,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
}

export async function getPublicTrackerController(
  _request: Request,
  response: Response<ApiResponse<PublicTracker>, TrackerRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const slug = response.locals.slug;
    if (!slug) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid tracker slug.'));
      return;
    }

    const tracker = await getPublicTracker(slug);
    if (!tracker) {
      next(new HttpError(404, ERROR_CODES.NOT_FOUND, 'Tracker not found.'));
      return;
    }

    response.json({ success: true, data: tracker });
  } catch (error: unknown) {
    next(error);
  }
}

export async function getOwnerAccessController(
  request: Request,
  response: Response<ApiResponse<OwnershipResponse>, TrackerRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const slug = response.locals.slug;
    if (!slug) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid tracker slug.'));
      return;
    }

    const access = await getTrackerAccess(
      slug,
      request.cookies ?? {},
      response.locals.authUser?.id
    );
    response.json({ success: true, data: access });
  } catch (error: unknown) {
    next(error);
  }
}
