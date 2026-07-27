import { useCallback } from 'react';
import { claimTracker, type ClaimTrackerInput, type ClaimTrackerResult } from '../api/auth-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

export function useClaimTracker(): MutationHookResult<ClaimTrackerInput, ClaimTrackerResult> {
  const mutation = useCallback(
    (input: ClaimTrackerInput, signal: AbortSignal) => claimTracker(input, signal),
    []
  );
  return useRequestMutation(mutation);
}
