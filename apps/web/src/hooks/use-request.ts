import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';
import { ApiError, toApiError } from '../lib/api-error';
import type { RequestState } from '../lib/request-state';

type RequestFunction<T> = (signal: AbortSignal) => Promise<T>;

export type DataHookResult<T> = RequestState<T> & {
  refetch: () => void;
};

export function useRequest<T>(
  request: RequestFunction<T>,
  dependencies: DependencyList = []
): DataHookResult<T> {
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setState((current) => ({ ...current, error: null, isLoading: true, status: 'loading' }));

    request(controller.signal)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setState({ data, error: null, isLoading: false, status: 'success' });
      })
      .catch((error: unknown) => {
        const apiError = toApiError(error);
        if (apiError.isAborted || requestId !== requestIdRef.current) return;
        setState((current) => ({ ...current, error: apiError, isLoading: false, status: 'error' }));
      });

    return () => controller.abort();
  }, [request, refreshKey, ...dependencies]);

  const refetch = useCallback(() => setRefreshKey((current) => current + 1), []);

  return { ...state, refetch };
}

type MutationFunction<TVariables, TData> = (
  variables: TVariables,
  signal: AbortSignal
) => Promise<TData>;

export type MutationHookResult<TVariables, TData> = {
  data: TData | null;
  error: ApiError | null;
  status: RequestState<TData>['status'];
  isPending: boolean;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
};

export function useRequestMutation<TVariables, TData>(
  mutation: MutationFunction<TVariables, TData>
): MutationHookResult<TVariables, TData> {
  const [state, setState] = useState<RequestState<TData>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
  });
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setState({ data: null, error: null, isLoading: true, status: 'loading' });

      try {
        const data = await mutation(variables, controller.signal);
        if (requestId === requestIdRef.current) {
          setState({ data, error: null, isLoading: false, status: 'success' });
        }
        return data;
      } catch (error: unknown) {
        const apiError = toApiError(error);
        if (!apiError.isAborted && requestId === requestIdRef.current) {
          setState({ data: null, error: apiError, isLoading: false, status: 'error' });
        }
        throw apiError;
      }
    },
    [mutation]
  );

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      requestIdRef.current += 1;
    },
    []
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    requestIdRef.current += 1;
    setState({ data: null, error: null, isLoading: false, status: 'idle' });
  }, []);

  return {
    data: state.data,
    error: state.error,
    status: state.status,
    isPending: state.isLoading,
    mutate,
    reset,
  };
}
