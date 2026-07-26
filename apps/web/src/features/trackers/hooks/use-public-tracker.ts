import { useCallback } from 'react';
import { getPublicTracker, type PublicTracker } from '../api/tracker-api';
import { useRequest, type DataHookResult } from '../../../hooks/use-request';

export function usePublicTracker(slug: string): DataHookResult<PublicTracker> {
  const request = useCallback((signal: AbortSignal) => getPublicTracker(slug, signal), [slug]);
  return useRequest(request, [slug]);
}
