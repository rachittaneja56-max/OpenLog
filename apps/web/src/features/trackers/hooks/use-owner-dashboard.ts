import type { ApiError } from '../../../lib/api-error';
import { useOwnerAccess } from './use-owner-access';
import { usePublicTracker } from './use-public-tracker';

export type OwnerDashboardState = {
  tracker: ReturnType<typeof usePublicTracker>['data'];
  isOwner: boolean;
  isLoading: boolean;
  error: ApiError | null;
  refreshTracker: () => void;
  refetchAccess: () => void;
};

export function useOwnerDashboard(slug: string): OwnerDashboardState {
  const tracker = usePublicTracker(slug);
  const ownerAccess = useOwnerAccess(slug);

  return {
    tracker: tracker.data,
    isOwner: ownerAccess.data?.isOwner === true,
    isLoading: tracker.isLoading || ownerAccess.isLoading,
    error: tracker.error ?? ownerAccess.error,
    refreshTracker: tracker.refetch,
    refetchAccess: ownerAccess.refetch,
  };
}
