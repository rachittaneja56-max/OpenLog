import { useCallback } from 'react';
import { deleteEntry } from '../api/entry-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

type DeleteEntryVariables = { slug: string; entryId: string };

export function useDeleteEntry(): MutationHookResult<DeleteEntryVariables, void> {
  const mutation = useCallback(
    ({ slug, entryId }: DeleteEntryVariables, signal: AbortSignal) =>
      deleteEntry(slug, entryId, signal),
    []
  );
  return useRequestMutation(mutation);
}
