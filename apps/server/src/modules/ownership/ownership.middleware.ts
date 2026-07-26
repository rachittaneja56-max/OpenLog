import type { NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { checkOwnership } from './ownership.service';

export async function requireOwnership(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownership = await checkOwnership(request.params.slug, request.cookies ?? {});

    if (!ownership.isOwner) {
      next(new HttpError(403, ERROR_CODES.FORBIDDEN, 'Owner access required.'));
      return;
    }

    next();
  } catch {
    next(new HttpError(403, ERROR_CODES.FORBIDDEN, 'Owner access required.'));
  }
}
