import rateLimit from 'express-rate-limit';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { optionalAuthentication } from '../auth/auth.middleware';
import {
  createTrackerController,
  getOwnerAccessController,
  getPublicTrackerController,
} from './tracker.controller';
import { trackerCreationSchema } from './tracker.schemas';
import { getFieldErrors, trackerSlugParamSchema } from '../../utils/validation';
import type { TrackerRouteLocals } from './tracker.types';
import { entryRouter } from '../entries/entry.routes';

export const trackerRouter = Router();

const trackerCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message: 'Too many tracker creation attempts. Please try again later.',
      },
    });
  },
});

function validateTrackerCreation(
  request: Request,
  response: Response<unknown, TrackerRouteLocals>,
  next: NextFunction
): void {
  const parsed = trackerCreationSchema.safeParse(request.body);
  if (!parsed.success) {
    next(
      new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Invalid tracker input.',
        getFieldErrors(parsed.error)
      )
    );
    return;
  }

  response.locals.trackerInput = parsed.data;
  next();
}

function validateTrackerSlug(
  request: Request,
  response: Response<unknown, TrackerRouteLocals>,
  next: NextFunction
): void {
  const parsed = trackerSlugParamSchema.safeParse(request.params);
  if (!parsed.success) {
    next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid tracker slug.'));
    return;
  }

  response.locals.slug = parsed.data.slug;
  next();
}

trackerRouter.post(
  '/',
  trackerCreationLimiter,
  optionalAuthentication,
  validateTrackerCreation,
  createTrackerController
);
trackerRouter.use('/:slug/entries', entryRouter);
trackerRouter.get(
  '/:slug/access',
  validateTrackerSlug,
  optionalAuthentication,
  getOwnerAccessController
);
trackerRouter.get('/:slug', validateTrackerSlug, getPublicTrackerController);
