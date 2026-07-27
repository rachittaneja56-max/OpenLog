import { useCallback } from 'react';
import { logout } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

export function useLogout(): MutationHookResult<undefined, void> {
  const mutation = useCallback((_input: undefined, signal: AbortSignal) => logout(signal), []);
  return useRequestMutation(mutation);
}
