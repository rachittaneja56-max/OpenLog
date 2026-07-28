import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { RequestState } from '../../lib/request-state';
import { SESSION_INVALIDATED_EVENT } from '../../lib/api-client';
import { toApiError } from '../../lib/api-error';
import { getCurrentUser, type AuthenticatedSession } from './api/auth-api';

type AuthenticatedUser = Extract<AuthenticatedSession, { authenticated: true }>['user'];

type AuthContextValue = RequestState<AuthenticatedSession> & {
  refetch: () => void;
  setAuthenticatedUser: (user: AuthenticatedUser) => void;
  setUnauthenticated: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const unauthenticatedSession: AuthenticatedSession = {
  authenticated: false,
  user: null,
};

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<RequestState<AuthenticatedSession>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
  });
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const setAuthenticatedUser = useCallback((user: AuthenticatedUser): void => {
    controllerRef.current?.abort();
    requestIdRef.current += 1;
    setState({
      data: { authenticated: true, user },
      error: null,
      status: 'success',
      isLoading: false,
    });
  }, []);

  const setUnauthenticated = useCallback((): void => {
    controllerRef.current?.abort();
    requestIdRef.current += 1;
    setState({
      data: unauthenticatedSession,
      error: null,
      status: 'success',
      isLoading: false,
    });
  }, []);

  const refetch = useCallback((): void => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setState((current) => ({
      ...current,
      error: null,
      status: 'loading',
      isLoading: true,
    }));

    void getCurrentUser(controller.signal)
      .then((session) => {
        if (requestId !== requestIdRef.current) return;
        setState({
          data: session,
          error: null,
          status: 'success',
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        const apiError = toApiError(error);
        if (apiError.isAborted || requestId !== requestIdRef.current) return;
        setState((current) => ({
          ...current,
          error: apiError,
          status: 'error',
          isLoading: false,
        }));
      });
  }, []);

  useEffect(() => {
    refetch();

    const refreshOnFocus = (): void => refetch();
    window.addEventListener('focus', refreshOnFocus);
    window.addEventListener(SESSION_INVALIDATED_EVENT, setUnauthenticated);

    return () => {
      controllerRef.current?.abort();
      requestIdRef.current += 1;
      window.removeEventListener('focus', refreshOnFocus);
      window.removeEventListener(SESSION_INVALIDATED_EVENT, setUnauthenticated);
    };
  }, [refetch, setUnauthenticated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      refetch,
      setAuthenticatedUser,
      setUnauthenticated,
    }),
    [refetch, setAuthenticatedUser, setUnauthenticated, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthSession must be used inside AuthProvider.');
  return context;
}
