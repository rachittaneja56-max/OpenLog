import { useCallback } from 'react';
import type { AuthCredentialsInput } from '@openlog/shared';
import { register, type LoginResult } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

export function useRegister(): MutationHookResult<AuthCredentialsInput, LoginResult> {
  const mutation = useCallback(
    (input: AuthCredentialsInput, signal: AbortSignal) => register(input, signal),
    []
  );
  return useRequestMutation(mutation);
}
