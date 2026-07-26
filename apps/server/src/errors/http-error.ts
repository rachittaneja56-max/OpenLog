import type { ErrorCode } from '@openlog/shared';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  public constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
