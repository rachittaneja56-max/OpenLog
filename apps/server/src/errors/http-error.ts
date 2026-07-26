import type { ErrorCode } from '@openlog/shared';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly fieldErrors: Record<string, string[]> | undefined;

  public constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}
