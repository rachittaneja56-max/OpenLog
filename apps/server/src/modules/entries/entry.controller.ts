import type { NextFunction, Request, Response } from 'express';
import { type ApiResponse, ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { createEntry, deleteEntry, updateEntry } from './entry.service';
import type { EntryRouteLocals, PublicEntry } from './entry.types';

type EntryResponse = ApiResponse<PublicEntry>;

function getRouteValues(locals: EntryRouteLocals): { slug: string; entryId?: string } | undefined {
  const { slug, entryId } = locals;
  return slug ? { slug, entryId } : undefined;
}

export async function createEntryController(
  request: Request,
  response: Response<EntryResponse, EntryRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const route = getRouteValues(response.locals);
    const input = response.locals.entryInput;
    if (!route?.slug || !input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid entry request.'));
      return;
    }

    const entry = await createEntry(
      route.slug,
      input,
      request.cookies ?? {},
      response.locals.authUser?.id
    );
    response.status(201).json({ success: true, data: entry });
  } catch (error: unknown) {
    next(error);
  }
}

export async function updateEntryController(
  request: Request,
  response: Response<EntryResponse, EntryRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const route = getRouteValues(response.locals);
    const input = response.locals.entryUpdateInput;
    if (!route?.slug || !route.entryId || !input) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid entry request.'));
      return;
    }

    const entry = await updateEntry(
      route.slug,
      route.entryId,
      input,
      request.cookies ?? {},
      response.locals.authUser?.id
    );
    response.json({ success: true, data: entry });
  } catch (error: unknown) {
    next(error);
  }
}

export async function deleteEntryController(
  request: Request,
  response: Response<void, EntryRouteLocals>,
  next: NextFunction
): Promise<void> {
  try {
    const route = getRouteValues(response.locals);
    if (!route?.slug || !route.entryId) {
      next(new HttpError(400, ERROR_CODES.INVALID_REQUEST, 'Invalid entry request.'));
      return;
    }

    await deleteEntry(
      route.slug,
      route.entryId,
      request.cookies ?? {},
      response.locals.authUser?.id
    );
    response.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
}
