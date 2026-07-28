import { useCallback } from 'react';
import type { AuthCredentialsInput } from '@openlog/shared';
import { register, type LoginResult } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';
import { useAuthSession } from '../auth-context';

export function useRegister(): MutationHookResult<AuthCredentialsInput, LoginResult> {
  const { setAuthenticatedUser } = useAuthSession();
  const mutation = useCallback(
    async (input: AuthCredentialsInput, signal: AbortSignal) => {
      const result = await register(input, signal);
      setAuthenticatedUser(result.user);
      return result;
    },
    [setAuthenticatedUser]
  );
  return useRequestMutation(mutation);
}
