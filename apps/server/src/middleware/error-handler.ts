import type { ErrorRequestHandler } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../errors/http-error';

function getParserErrorType(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('type' in error)) return undefined;
  const type = (error as { type?: unknown }).type;
  return typeof type === 'string' ? type : undefined;
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next): void => {
  void _next;

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      },
    });
    return;
  }

  const parserErrorType = getParserErrorType(error);
  if (parserErrorType === 'entity.too.large') {
    response.status(413).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_REQUEST,
        message: 'Request body is too large.',
      },
    });
    return;
  }

  if (parserErrorType === 'entity.parse.failed') {
    response.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_REQUEST,
        message: 'Request body is not valid JSON.',
      },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'An unexpected server error occurred.',
    },
  });
};
