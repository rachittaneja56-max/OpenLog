import { useCallback } from 'react';
import type { AuthCredentialsInput } from '@openlog/shared';
import { login, type LoginResult } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

export function useLogin(): MutationHookResult<AuthCredentialsInput, LoginResult> {
  const mutation = useCallback(
    (input: AuthCredentialsInput, signal: AbortSignal) => login(input, signal),
    []
  );
  return useRequestMutation(mutation);
}
