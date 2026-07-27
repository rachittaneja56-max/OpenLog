import { buildActivityMonthLabels } from '@openlog/shared';
import { Link2, MoveRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  SectionHeading,
} from '../components/ui';
import { scrollToEntry } from '../features/entries/utils';
import {
  PublicEntryCard,
  PublicLogNotFound,
  PublicTrackerHero,
  TrackerHeatmap,
} from '../features/trackers/components';
import { usePublicTracker, usePublicTrackerMetadata } from '../features/trackers/hooks';

export function PublicTrackerPage(): JSX.Element {
  const { slug = '' } = useParams();
  const tracker = usePublicTracker(slug);
  const data = tracker.data;
  usePublicTrackerMetadata(data);

  const monthLabels = useMemo(() => buildActivityMonthLabels(data?.heatmap ?? []), [data?.heatmap]);
  const entryIdsByDate = useMemo(
    () => new Map((data?.entries ?? []).map((entry) => [entry.entryDate, entry.id])),
    [data?.entries]
  );
  const selectEntryDate = useCallback(
    (date: string): void => {
      const entryId = entryIdsByDate.get(date);
      if (entryId) scrollToEntry(entryId);
    },
    [entryIdsByDate]
  );

  if (tracker.isLoading && !data) return <LoadingBlock label="Loading public log" />;
  if (tracker.error?.code === 'NOT_FOUND' && !data) return <PublicLogNotFound />;
  if (tracker.error && !data) {
    return <ErrorState description={tracker.error.message} onRetry={tracker.refetch} />;
  }
  if (!data) return <ErrorState description="This public log is not available." />;

  const publicUrl = window.location.href;

  return (
    <div className="space-y-16 pb-10 md:space-y-24">
      <PublicTrackerHero tracker={data} publicUrl={publicUrl} />

      <section aria-labelledby="activity-heading">
        <Card variant="pink">
          <SectionHeading id="activity-heading" eyebrow="12 weeks in public">
            Activity heatmap
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-medium">
            Every square is a day. Brighter means more time spent learning.
          </p>
          <div className="mt-7">
            <TrackerHeatmap
              days={data.heatmap}
              monthLabels={monthLabels}
              onSelectDate={selectEntryDate}
            />
          </div>
        </Card>
      </section>

      <section aria-labelledby="timeline-heading">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="timeline-heading" eyebrow="The trail so far">
            Daily learning entries
          </SectionHeading>
          <Badge tone="yellow">{data.stats.totalEntries} TOTAL ENTRIES</Badge>
        </div>
        {data.entries.length === 0 ? (
          <EmptyState
            title="THE FIRST LOG HAS NOT BEEN WRITTEN YET."
            description="This is where the first honest note will land. Come back soon, or start a public learning log of your own."
            action={
              <Link
                className="neo-button inline-flex items-center gap-2 bg-green px-5 py-4"
                to="/#create-log"
              >
                START YOUR OWN LOG <MoveRight aria-hidden="true" size={18} strokeWidth={3} />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6">
            {data.entries.map((entry, index) => (
              <PublicEntryCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}
      </section>

      <section
        className="neo-box bg-orange p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-10"
        aria-labelledby="public-cta-heading"
      >
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            MAKE YOUR OWN TRAIL
          </p>
          <h2 id="public-cta-heading" className="mt-3 text-4xl md:text-5xl">
            LEARN IT. LOG IT. SHOW IT.
          </h2>
        </div>
        <Link
          className="neo-button mt-7 inline-flex shrink-0 items-center gap-2 bg-surface px-5 py-4 md:mt-0"
          to="/#create-log"
        >
          CREATE A PUBLIC LOG <Link2 aria-hidden="true" size={18} strokeWidth={3} />
        </Link>
      </section>

      <footer className="border-t-[3px] border-border pt-7" aria-label="OpenLog footer">
        <div className="flex flex-col gap-4 font-mono text-xs font-bold uppercase tracking-widest md:flex-row md:items-center md:justify-between">
          <span>BUILT WITH OPENLOG</span>
          <span>LEARN IT. LOG IT. SHOW IT.</span>
          <Link className="underline underline-offset-4" to="/#create-log">
            CREATE ANOTHER PUBLIC LEARNING LOG
          </Link>
        </div>
      </footer>
    </div>
  );
}
