import { useCallback } from 'react';
import { getCurrentUser, type AuthenticatedSession } from '../api/auth-api';
import { useRequest, type DataHookResult } from '../../../hooks/use-request';

export function useAuthMe(): DataHookResult<AuthenticatedSession> {
  const request = useCallback((signal: AbortSignal) => getCurrentUser(signal), []);
  return useRequest(request, []);
}
