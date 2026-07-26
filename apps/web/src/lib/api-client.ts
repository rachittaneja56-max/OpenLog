import type { ApiFailure, ApiResponse } from '@openlog/shared';
import { ApiError, toApiError } from './api-error';

const API_PREFIX = '/api';

type ApiResponseData<T> = ApiResponse<T>;

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

function getApiPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_PREFIX}${normalizedPath}`;
}

function isApiFailure<T>(value: ApiResponseData<T>): value is ApiFailure {
  if (value.success !== false || typeof value.error !== 'object' || value.error === null)
    return false;
  return (
    typeof value.error.code === 'string' &&
    typeof value.error.message === 'string' &&
    (value.error.fieldErrors === undefined || typeof value.error.fieldErrors === 'object')
  );
}

function isApiSuccess<T>(
  value: ApiResponseData<T>
): value is Extract<ApiResponseData<T>, { success: true }> {
  return value.success === true && 'data' in value;
}

function parseResponseBody(text: string, status: number): unknown {
  if (!text.trim()) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError('malformed', 'MALFORMED_RESPONSE', status);
  }
}

function getFailureError(failure: ApiFailure, status: number): ApiError {
  const code = typeof failure.error.code === 'string' ? failure.error.code : 'API_ERROR';
  return new ApiError('api', code, status, failure.error.fieldErrors);
}

function isApiResponse<T>(value: unknown): value is ApiResponseData<T> {
  if (typeof value !== 'object' || value === null || !('success' in value)) return false;
  const response = value as { success: unknown };
  return response.success === true || response.success === false;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers: suppliedHeaders, ...requestInit } = options;
  const headers = new Headers(suppliedHeaders);

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(getApiPath(path), {
      ...requestInit,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'include',
      headers,
    });
  } catch (error) {
    throw toApiError(error);
  }

  const text = await response.text();
  const parsed = parseResponseBody(text, response.status);

  if (!response.ok) {
    if (isApiResponse<never>(parsed) && isApiFailure(parsed)) {
      throw getFailureError(parsed, response.status);
    }
    throw new ApiError('api', 'HTTP_ERROR', response.status);
  }

  if (!text.trim()) return undefined as T;
  if (!isApiResponse<T>(parsed) || !isApiSuccess(parsed)) {
    throw new ApiError('malformed', 'MALFORMED_RESPONSE', response.status);
  }

  return parsed.data;
}
