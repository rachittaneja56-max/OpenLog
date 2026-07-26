import { buildActivityMonthLabels } from '@openlog/shared';
import { ExternalLink, Link2, MoveRight } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  SectionHeading,
  Sticker,
} from '../components/ui';
import { formatEntryDate } from '../features/entries/utils';
import { PublicShareActions } from '../features/sharing/components';
import { TrackerHeatmap } from '../features/trackers/components';
import { usePublicTracker } from '../features/trackers/hooks/use-public-tracker';

const entryAccents = ['bg-green', 'bg-blue', 'bg-pink', 'bg-yellow'] as const;

function formatStreak(value: number): string {
  return String(value).padStart(2, '0');
}

function formatCreatedDate(value: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    dateStyle: 'medium',
  }).format(new Date(value));
}

function InvalidLogState(): JSX.Element {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <Card variant="orange" className="text-center">
        <Sticker tone="pink">404 PUBLIC LOG</Sticker>
        <h1 className="mt-8 text-5xl leading-[0.92] md:text-7xl">THIS LOG DOES NOT EXIST.</h1>
        <p className="mx-auto mt-5 max-w-lg font-medium leading-relaxed">
          That public learning link is not available. Start a new log and make your own trail.
        </p>
        <Link className="neo-button mt-8 inline-flex bg-surface px-5 py-4" to="/">
          GO TO OPENLOG
        </Link>
      </Card>
    </div>
  );
}

function PublicEntryCard({
  entry,
  index,
}: {
  entry: {
    id: string;
    entryDate: string;
    learned: string;
    confusedAbout: string | null;
    nextStep: string | null;
    minutesSpent: number | null;
    resourceUrl: string | null;
  };
  index: number;
}): JSX.Element {
  return (
    <article
      id={`entry-${entry.id}`}
      tabIndex={-1}
      className={`neo-box p-5 md:p-8 ${entryAccents[index % entryAccents.length]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            ENTRY {String(index + 1).padStart(2, '0')} · {formatEntryDate(entry.entryDate)}
          </p>
          <h3 className="mt-4 text-3xl md:text-4xl">LEARNING NOTE</h3>
        </div>
        {entry.minutesSpent !== null ? (
          <Badge tone="default">{entry.minutesSpent} MINUTES</Badge>
        ) : null}
      </div>

      <p className="mt-6 max-w-4xl whitespace-pre-wrap text-lg font-bold leading-relaxed md:text-xl">
        {entry.learned}
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {entry.confusedAbout ? (
          <div className="border-t-[3px] border-border pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              STILL FIGURING OUT
            </p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">
              {entry.confusedAbout}
            </p>
          </div>
        ) : null}
        {entry.nextStep ? (
          <div className="border-t-[3px] border-border pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">NEXT</p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{entry.nextStep}</p>
          </div>
        ) : null}
      </div>

      {entry.resourceUrl ? (
        <a
          className="mt-7 inline-flex max-w-full items-center gap-2 break-all border-2 border-border bg-surface px-3 py-2 font-mono text-xs font-bold uppercase underline"
          href={entry.resourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          RESOURCE <ExternalLink aria-hidden="true" size={15} strokeWidth={3} />
        </a>
      ) : null}
    </article>
  );
}

export function PublicTrackerPage(): JSX.Element {
  const { slug = '' } = useParams();
  const tracker = usePublicTracker(slug);
  const data = tracker.data;
  const monthLabels = useMemo(() => buildActivityMonthLabels(data?.heatmap ?? []), [data?.heatmap]);
  const entryIdsByDate = useMemo(() => {
    const entries = data?.entries ?? [];
    return new Map(entries.map((entry) => [entry.entryDate, entry.id]));
  }, [data?.entries]);

  const selectEntryDate = useCallback(
    (date: string): void => {
      const entryId = entryIdsByDate.get(date);
      if (!entryId) return;
      const element = document.getElementById(`entry-${entryId}`);
      if (!element) return;
      element.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
      element.focus({ preventScroll: true });
    },
    [entryIdsByDate]
  );

  useEffect(() => {
    if (!data) return;
    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content');
    const learner = data.displayName?.trim() || 'Someone';
    const description =
      data.description?.trim() || `${learner} is learning ${data.topic} in public with OpenLog.`;
    let descriptionMeta = meta;

    document.title = `${data.topic} · OpenLog`;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', description.slice(0, 160));

    return () => {
      document.title = previousTitle;
      if (meta) {
        if (previousDescription === null) meta.removeAttribute('content');
        else meta.setAttribute('content', previousDescription ?? '');
      } else {
        descriptionMeta?.remove();
      }
    };
  }, [data]);

  if (tracker.isLoading && !data) return <LoadingBlock label="Loading public log" />;
  if (tracker.error?.code === 'NOT_FOUND' && !data) return <InvalidLogState />;
  if (tracker.error && !data) {
    return <ErrorState description={tracker.error.message} onRetry={tracker.refetch} />;
  }
  if (!data) return <ErrorState description="This public log is not available." />;

  const learnerLine = data.displayName?.trim()
    ? `${data.displayName.toUpperCase()} IS LEARNING`
    : 'SOMEONE IS LEARNING';
  const publicUrl = typeof window === 'undefined' ? '' : window.location.href;
  const latestActivity = data.stats.latestEntryDate
    ? formatEntryDate(data.stats.latestEntryDate)
    : 'NO ACTIVITY YET';

  return (
    <div className="space-y-16 pb-10 md:space-y-24">
      <section
        className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch"
        aria-labelledby="public-log-heading"
      >
        <div className="neo-box flex min-w-0 flex-col justify-between bg-purple p-6 md:p-10">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">
                PUBLIC LEARNING POSTER
              </p>
              <Sticker tone="green">NO LOGIN REQUIRED</Sticker>
            </div>
            <h1
              id="public-log-heading"
              className="mt-10 text-5xl leading-[0.9] sm:text-6xl md:text-8xl"
            >
              {learnerLine}
            </h1>
            <p className="mt-7 max-w-4xl break-words text-4xl leading-[0.92] md:text-6xl">
              {data.topic}
            </p>
            {data.description ? (
              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed">
                {data.description}
              </p>
            ) : null}
          </div>
          <div className="mt-10 border-t-[3px] border-border pt-5">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              OPENLOG PUBLIC LOG
            </p>
            <p className="mt-2 max-w-xl font-medium">
              A visible record of the work, one day at a time.
            </p>
            {publicUrl ? (
              <div className="mt-5">
                <PublicShareActions
                  url={publicUrl}
                  title={`${data.topic} · OpenLog`}
                  text={`${learnerLine} — follow this public learning log.`}
                />
              </div>
            ) : null}
          </div>
        </div>

        <Card variant="yellow" className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              CONSISTENCY SCOREBOARD
            </p>
            <p className="mt-7 font-display text-[7rem] leading-[0.75] sm:text-[9rem] md:text-[10rem]">
              {formatStreak(data.stats.currentStreak)}
            </p>
            <p className="mt-5 font-display text-2xl uppercase md:text-3xl">DAY STREAK</p>
            <p className="mt-4 max-w-sm font-medium leading-relaxed">
              {data.stats.hasLoggedToday
                ? 'Today is on the board.'
                : 'LOG TODAY TO KEEP IT MOVING.'}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="border-2 border-border bg-surface p-4">
              <p className="font-mono text-[10px] font-bold uppercase">Longest</p>
              <p className="mt-2 font-display text-4xl">{data.stats.longestStreak}</p>
              <p className="font-mono text-[10px] font-bold uppercase">days</p>
            </div>
            <div className="border-2 border-border bg-pink p-4">
              <p className="font-mono text-[10px] font-bold uppercase">Active</p>
              <p className="mt-2 font-display text-4xl">{data.stats.totalActiveDays}</p>
              <p className="font-mono text-[10px] font-bold uppercase">days</p>
            </div>
          </div>
        </Card>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Learning statistics"
      >
        <Card variant="blue">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">TOTAL MINUTES</p>
          <p className="mt-3 font-display text-5xl">{data.stats.totalMinutes}</p>
        </Card>
        <Card variant="green">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">LEARNING STARTED</p>
          <p className="mt-3 font-display text-2xl leading-tight">
            {formatCreatedDate(data.createdAt, data.timezone)}
          </p>
        </Card>
        <Card variant="orange">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            MOST RECENT ACTIVITY
          </p>
          <p className="mt-3 font-display text-2xl leading-tight">{latestActivity}</p>
        </Card>
        <Card>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">TIMEZONE</p>
          <p className="mt-3 break-words font-display text-2xl leading-tight">{data.timezone}</p>
        </Card>
      </section>

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
