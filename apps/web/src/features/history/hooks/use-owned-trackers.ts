import { useCallback } from 'react';
import { useRequest, type DataHookResult } from '../../../hooks/use-request';
import { getOwnedTrackers, type OwnedTrackerSummary } from '../api/history-api';

export function useOwnedTrackers(): DataHookResult<OwnedTrackerSummary[]> {
  const request = useCallback((signal: AbortSignal) => getOwnedTrackers(signal), []);
  return useRequest(request, []);
}
