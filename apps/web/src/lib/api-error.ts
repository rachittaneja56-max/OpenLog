export type ApiErrorKind = 'aborted' | 'network' | 'api' | 'malformed';

const safeMessages: Record<ApiErrorKind, string> = {
  aborted: 'The request was cancelled.',
  network: 'We could not reach OpenLog. Check your connection and try again.',
  api: 'OpenLog could not complete that request.',
  malformed: 'OpenLog received an invalid response. Please try again.',
};

export class ApiError extends Error {
  public readonly kind: ApiErrorKind;
  public readonly code: string;
  public readonly status: number | null;
  public readonly fieldErrors: Record<string, string[]> | undefined;

  public constructor(
    kind: ApiErrorKind,
    code: string,
    status: number | null = null,
    fieldErrors?: Record<string, string[]>
  ) {
    super(safeMessages[kind]);
    this.name = 'ApiError';
    this.kind = kind;
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  public get isAborted(): boolean {
    return this.kind === 'aborted';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('aborted', 'REQUEST_ABORTED');
  }
  if (error instanceof TypeError) {
    return new ApiError('network', 'NETWORK_ERROR');
  }
  return new ApiError('network', 'UNKNOWN_ERROR');
}
