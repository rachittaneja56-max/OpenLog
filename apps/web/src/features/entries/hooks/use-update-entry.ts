import { useCallback } from 'react';
import { updateEntry, type UpdateEntryInput } from '../api/entry-api';
import type { TrackerEntry } from '../../trackers/api/tracker-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

type UpdateEntryVariables = { slug: string; entryId: string; input: UpdateEntryInput };

export function useUpdateEntry(): MutationHookResult<UpdateEntryVariables, TrackerEntry> {
  const mutation = useCallback(
    ({ slug, entryId, input }: UpdateEntryVariables, signal: AbortSignal) =>
      updateEntry(slug, entryId, input, signal),
    []
  );
  return useRequestMutation(mutation);
}
