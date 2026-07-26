import { useParams } from 'react-router-dom';
import { Card, ErrorState, LoadingBlock, SectionHeading, StatCard } from '../components/ui';
import { useOwnerAccess } from '../features/trackers/hooks/use-owner-access';
import { usePublicTracker } from '../features/trackers/hooks/use-public-tracker';

export function DashboardPage(): JSX.Element {
  const { slug = '' } = useParams();
  const ownerAccess = useOwnerAccess(slug);
  const tracker = usePublicTracker(slug);

  if (ownerAccess.isLoading || tracker.isLoading)
    return <LoadingBlock label="Checking owner access" />;
  if (ownerAccess.error)
    return <ErrorState description={ownerAccess.error.message} onRetry={ownerAccess.refetch} />;
  if (!ownerAccess.data?.isOwner) {
    return (
      <ErrorState
        title="Owner access required"
        description="This dashboard is only available in its creator browser."
      />
    );
  }
  if (tracker.error || !tracker.data) {
    return (
      <ErrorState
        description={tracker.error?.message ?? 'This tracker is not available.'}
        onRetry={tracker.refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Owner dashboard">
        {tracker.data.displayName ?? tracker.data.topic}
      </SectionHeading>
      <Card variant="green">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">
          Owner access confirmed
        </p>
        <p className="mt-3 font-medium">
          Your private browser cookie is recognized. Entry controls arrive in the next phase.
        </p>
      </Card>
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          variant="yellow"
          label="Current streak"
          value={tracker.data.stats.currentStreak}
          detail="days"
        />
        <StatCard
          variant="pink"
          label="Longest streak"
          value={tracker.data.stats.longestStreak}
          detail="days"
        />
        <StatCard
          variant="blue"
          label="Active days"
          value={tracker.data.stats.totalActiveDays}
          detail="total"
        />
      </div>
    </div>
  );
}
