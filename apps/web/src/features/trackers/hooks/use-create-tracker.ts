import { useCallback } from 'react';
import { createTracker, type CreateTrackerInput, type CreatedTracker } from '../api/tracker-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

export function useCreateTracker(): MutationHookResult<CreateTrackerInput, CreatedTracker> {
  const mutation = useCallback(
    (input: CreateTrackerInput, signal: AbortSignal) => createTracker(input, signal),
    []
  );
  return useRequestMutation(mutation);
}
