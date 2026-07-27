import type { Request, Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';

export function apiNotFoundHandler(request: Request, response: Response): void {
  void request;
  response.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'API endpoint not found.',
    },
  });
}

export function frontendNotFoundHandler(request: Request, response: Response): void {
  void request;
  response.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'Resource not found.',
    },
  });
}
