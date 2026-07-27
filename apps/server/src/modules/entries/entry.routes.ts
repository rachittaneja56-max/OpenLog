import { Router, type NextFunction, type Request, type Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { requireOwnership } from '../ownership/ownership.middleware';
import {
  createEntryController,
  deleteEntryController,
  updateEntryController,
} from './entry.controller';
import { entryCreationSchema, entryIdParamSchema, entryUpdateSchema } from './entry.schemas';
import type { EntryRouteLocals } from './entry.types';
import { getFieldErrors, trackerSlugParamSchema } from '../../utils/validation';

export const entryRouter = Router({ mergeParams: true });

function validateSlug(
  request: Request,
  response: Response<unknown, EntryRouteLocals>,
  next: NextFunction
): void {
  const parsed = trackerSlugParamSchema.safeParse({ slug: request.params.slug });
  if (!parsed.success) {
    next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid tracker slug.'));
    return;
  }
  response.locals.slug = parsed.data.slug;
  next();
}

function validateEntryId(
  request: Request,
  response: Response<unknown, EntryRouteLocals>,
  next: NextFunction
): void {
  const parsed = entryIdParamSchema.safeParse({ entryId: request.params.entryId });
  if (!parsed.success) {
    next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid entry id.'));
    return;
  }
  response.locals.entryId = parsed.data.entryId;
  next();
}

function validateCreateBody(
  request: Request,
  response: Response<unknown, EntryRouteLocals>,
  next: NextFunction
): void {
  const parsed = entryCreationSchema.safeParse(request.body);
  if (!parsed.success) {
    next(
      new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Invalid entry input.',
        getFieldErrors(parsed.error)
      )
    );
    return;
  }
  response.locals.entryInput = parsed.data;
  next();
}

function validateUpdateBody(
  request: Request,
  response: Response<unknown, EntryRouteLocals>,
  next: NextFunction
): void {
  const parsed = entryUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    next(
      new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Invalid entry input.',
        getFieldErrors(parsed.error)
      )
    );
    return;
  }
  response.locals.entryUpdateInput = parsed.data;
  next();
}

entryRouter.post('/', validateSlug, requireOwnership, validateCreateBody, createEntryController);
entryRouter.patch(
  '/:entryId',
  validateSlug,
  validateEntryId,
  requireOwnership,
  validateUpdateBody,
  updateEntryController
);
entryRouter.delete(
  '/:entryId',
  validateSlug,
  validateEntryId,
  requireOwnership,
  deleteEntryController
);
