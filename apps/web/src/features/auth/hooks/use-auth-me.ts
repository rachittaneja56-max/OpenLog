import type { AuthenticatedSession } from '../api/auth-api';
import type { DataHookResult } from '../../../hooks/use-request';
import { useAuthSession } from '../auth-context';

export function useAuthMe(): DataHookResult<AuthenticatedSession> {
  const auth = useAuthSession();
  return {
    data: auth.data,
    error: auth.error,
    status: auth.status,
    isLoading: auth.isLoading,
    refetch: auth.refetch,
  };
}
