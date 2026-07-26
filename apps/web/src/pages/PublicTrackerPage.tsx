import { useParams } from 'react-router-dom';
import { Card, ErrorState, LoadingBlock, SectionHeading, StatCard } from '../components/ui';
import { usePublicTracker } from '../features/trackers/hooks/use-public-tracker';

export function PublicTrackerPage(): JSX.Element {
  const { slug = '' } = useParams();
  const tracker = usePublicTracker(slug);

  if (tracker.isLoading && !tracker.data) return <LoadingBlock label="Loading tracker" />;
  if (tracker.error && !tracker.data) {
    return <ErrorState description={tracker.error.message} onRetry={tracker.refetch} />;
  }
  if (!tracker.data) return <ErrorState description="This tracker is not available." />;

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Public learning log">
        {tracker.data.displayName ?? tracker.data.topic}
      </SectionHeading>
      <Card variant="purple">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">Topic</p>
        <p className="mt-3 text-2xl font-bold">{tracker.data.topic}</p>
        {tracker.data.description ? (
          <p className="mt-4 max-w-2xl font-medium">{tracker.data.description}</p>
        ) : null}
        <p className="mt-5 font-mono text-xs font-bold uppercase">
          Timezone: {tracker.data.timezone}
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
      <Card>
        <h2 className="text-2xl">Entries</h2>
        <p className="mt-3 font-medium">No learning entries have been added yet.</p>
      </Card>
    </div>
  );
}
