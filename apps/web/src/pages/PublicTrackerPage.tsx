import { buildActivityMonthLabels } from '@openlog/shared';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ErrorState, LoadingBlock, SectionHeading, StatCard } from '../components/ui';
import { formatEntryDate } from '../features/entries/utils';
import { TrackerHeatmap } from '../features/trackers/components';
import { usePublicTracker } from '../features/trackers/hooks/use-public-tracker';

export function PublicTrackerPage(): JSX.Element {
  const { slug = '' } = useParams();
  const tracker = usePublicTracker(slug);
  const monthLabels = useMemo(
    () => buildActivityMonthLabels(tracker.data?.heatmap ?? []),
    [tracker.data?.heatmap]
  );

  if (tracker.isLoading && !tracker.data) return <LoadingBlock label="Loading tracker" />;
  if (tracker.error && !tracker.data)
    return <ErrorState description={tracker.error.message} onRetry={tracker.refetch} />;
  if (!tracker.data) return <ErrorState description="This tracker is not available." />;

  const data = tracker.data;
  return (
    <div className="space-y-8">
      <section
        className="border-b-[3px] border-border pb-7"
        aria-labelledby="public-tracker-heading"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-widest">Public learning log</p>
        <h1 id="public-tracker-heading" className="mt-3 text-5xl">
          {data.displayName ?? data.topic}
        </h1>
        <p className="mt-4 font-display text-2xl uppercase">{data.topic}</p>
        {data.description ? (
          <p className="mt-4 max-w-2xl font-medium leading-relaxed">{data.description}</p>
        ) : null}
        <p className="mt-5 font-mono text-xs font-bold uppercase">
          {data.timezone} · Started {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="yellow"
          label="Current streak"
          value={data.stats.currentStreak}
          detail="days"
        />
        <StatCard
          variant="pink"
          label="Longest streak"
          value={data.stats.longestStreak}
          detail="days"
        />
        <StatCard
          variant="blue"
          label="Active days"
          value={data.stats.totalActiveDays}
          detail="total"
        />
        <StatCard
          variant="orange"
          label="Total minutes"
          value={data.stats.totalMinutes}
          detail="logged"
        />
      </div>

      <Card variant="purple">
        <SectionHeading eyebrow="Consistency">Activity heatmap</SectionHeading>
        <p className="mt-3 font-medium">A public view of the last 12 weeks.</p>
        <div className="mt-6">
          <TrackerHeatmap days={data.heatmap} monthLabels={monthLabels} />
        </div>
      </Card>

      <section aria-labelledby="public-entries-heading">
        <SectionHeading id="public-entries-heading" eyebrow="Learning in public" className="mb-5">
          Daily entries
        </SectionHeading>
        {data.entries.length === 0 ? (
          <Card>
            <h2 className="text-2xl">No learning entries yet.</h2>
            <p className="mt-3 font-medium">The first note will appear here.</p>
          </Card>
        ) : (
          <div className="grid gap-5">
            {data.entries.map((entry) => (
              <article key={entry.id} className="neo-box bg-surface p-5 md:p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-widest">
                  {formatEntryDate(entry.entryDate)}
                </p>
                <h2 className="mt-3 text-2xl">What was learned</h2>
                <p className="mt-3 whitespace-pre-wrap font-medium leading-relaxed">
                  {entry.learned}
                </p>
                {entry.confusedAbout ? (
                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                      Still unclear
                    </p>
                    <p className="mt-2 whitespace-pre-wrap font-medium">{entry.confusedAbout}</p>
                  </div>
                ) : null}
                {entry.nextStep ? (
                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                      Next step
                    </p>
                    <p className="mt-2 whitespace-pre-wrap font-medium">{entry.nextStep}</p>
                  </div>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs font-bold uppercase">
                  {entry.minutesSpent ? (
                    <span className="border-2 border-border bg-yellow px-2 py-1">
                      {entry.minutesSpent} min
                    </span>
                  ) : null}
                  {entry.resourceUrl ? (
                    <a
                      className="inline-flex items-center gap-2 border-2 border-border bg-blue px-2 py-1 underline"
                      href={entry.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Resource <ExternalLink aria-hidden="true" size={14} strokeWidth={3} />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
