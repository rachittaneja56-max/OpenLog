import { useCallback } from 'react';
import { getOwnerAccess, type OwnerAccess } from '../api/tracker-api';
import { useRequest, type DataHookResult } from '../../../hooks/use-request';

export function useOwnerAccess(slug: string): DataHookResult<OwnerAccess> {
  const request = useCallback((signal: AbortSignal) => getOwnerAccess(slug, signal), [slug]);
  return useRequest(request, [slug]);
}
