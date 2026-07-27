import type { ApiError } from '../../../lib/api-error';
import { useOwnerAccess } from './use-owner-access';
import { usePublicTracker } from './use-public-tracker';

export type OwnerDashboardState = {
  tracker: ReturnType<typeof usePublicTracker>['data'];
  isOwner: boolean;
  isTrackerLoading: boolean;
  isAccessLoading: boolean;
  trackerError: ApiError | null;
  accessError: ApiError | null;
  refreshTracker: () => void;
  refetchAccess: () => void;
};

export function useOwnerDashboard(slug: string): OwnerDashboardState {
  const tracker = usePublicTracker(slug);
  const ownerAccess = useOwnerAccess(slug);

  return {
    tracker: tracker.data,
    isOwner: ownerAccess.data?.isOwner === true,
    isTrackerLoading: tracker.isLoading,
    isAccessLoading: ownerAccess.isLoading,
    trackerError: tracker.error,
    accessError: ownerAccess.error,
    refreshTracker: tracker.refetch,
    refetchAccess: ownerAccess.refetch,
  };
}
