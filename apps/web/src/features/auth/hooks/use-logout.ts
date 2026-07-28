import { useCallback } from 'react';
import { logout } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';
import { useAuthSession } from '../auth-context';

export function useLogout(): MutationHookResult<undefined, void> {
  const { setUnauthenticated } = useAuthSession();
  const mutation = useCallback(
    async (_input: undefined, signal: AbortSignal) => {
      await logout(signal);
      setUnauthenticated();
    },
    [setUnauthenticated]
  );
  return useRequestMutation(mutation);
}
