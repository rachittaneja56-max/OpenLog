export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export type RequestState<T> = {
  data: T | null;
  error: import('./api-error').ApiError | null;
  status: RequestStatus;
  isLoading: boolean;
};
