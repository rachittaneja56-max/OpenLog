import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '@openlog/shared';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { getHealthStatus, type HealthStatus } from './health.service';

export async function getHealth(
  _request: Request,
  response: Response<ApiResponse<HealthStatus>>,
  next: NextFunction
): Promise<void> {
  try {
    const health = await getHealthStatus();

    if (!health) {
      next(new HttpError(503, ERROR_CODES.INTERNAL_SERVER_ERROR, 'Database unavailable.'));
      return;
    }

    response.json({
      success: true,
      data: health,
    });
  } catch {
    next(new HttpError(503, ERROR_CODES.INTERNAL_SERVER_ERROR, 'Database unavailable.'));
  }
}
