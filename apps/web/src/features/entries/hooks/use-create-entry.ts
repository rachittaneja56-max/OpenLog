import { useCallback } from 'react';
import { createEntry, type CreateEntryInput } from '../api/entry-api';
import type { TrackerEntry } from '../../trackers/api/tracker-api';
import { useRequestMutation, type MutationHookResult } from '../../../hooks/use-request';

type CreateEntryVariables = { slug: string; input: CreateEntryInput };

export function useCreateEntry(): MutationHookResult<CreateEntryVariables, TrackerEntry> {
  const mutation = useCallback(
    ({ slug, input }: CreateEntryVariables, signal: AbortSignal) =>
      createEntry(slug, input, signal),
    []
  );
  return useRequestMutation(mutation);
}
