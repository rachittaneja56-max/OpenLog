import { Card, Sticker } from '../../../components/ui';
import { formatEntryDate } from '../../entries/utils';
import { formatTrackerCreatedDate } from '../utils';
import { PublicShareActions } from '../../sharing/components';
import type { PublicTracker } from '../api/tracker-api';

function formatStreak(value: number): string {
  return String(value).padStart(2, '0');
}

type PublicTrackerHeroProps = {
  tracker: PublicTracker;
  publicUrl: string;
};

export function PublicTrackerHero({ tracker, publicUrl }: PublicTrackerHeroProps): JSX.Element {
  const learnerLine = tracker.displayName?.trim()
    ? `${tracker.displayName.toUpperCase()} IS LEARNING`
    : 'SOMEONE IS LEARNING';
  const latestActivity = tracker.stats.latestEntryDate
    ? formatEntryDate(tracker.stats.latestEntryDate)
    : 'NO ACTIVITY YET';

  return (
    <>
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
              <Sticker tone="green">PUBLIC BY DEFAULT</Sticker>
            </div>
            <h1
              id="public-log-heading"
              className="mt-10 break-words text-5xl leading-[0.9] sm:text-6xl md:text-8xl"
            >
              {learnerLine}
            </h1>
            <p className="mt-7 max-w-4xl break-words text-4xl leading-[0.92] md:text-6xl">
              {tracker.topic}
            </p>
            {tracker.description ? (
              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed">
                {tracker.description}
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
            <div className="mt-5">
              <PublicShareActions
                url={publicUrl}
                title={`${tracker.topic} \u00b7 OpenLog`}
                text={`${learnerLine} \u2014 follow this public learning log.`}
              />
            </div>
          </div>
        </div>

        <Card variant="yellow" className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              CONSISTENCY SCOREBOARD
            </p>
            <p className="mt-7 font-display text-[7rem] leading-[0.75] sm:text-[9rem] md:text-[10rem]">
              {formatStreak(tracker.stats.currentStreak)}
            </p>
            <p className="mt-5 font-display text-2xl uppercase md:text-3xl">DAY STREAK</p>
            <p className="mt-4 max-w-sm font-medium leading-relaxed">
              {tracker.stats.hasLoggedToday
                ? 'Today is on the board.'
                : 'LOG TODAY TO KEEP IT MOVING.'}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="border-2 border-border bg-surface p-4">
              <p className="font-mono text-[10px] font-bold uppercase">Longest</p>
              <p className="mt-2 font-display text-4xl">{tracker.stats.longestStreak}</p>
              <p className="font-mono text-[10px] font-bold uppercase">days</p>
            </div>
            <div className="border-2 border-border bg-pink p-4">
              <p className="font-mono text-[10px] font-bold uppercase">Active</p>
              <p className="mt-2 font-display text-4xl">{tracker.stats.totalActiveDays}</p>
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
          <p className="mt-3 font-display text-5xl">{tracker.stats.totalMinutes}</p>
        </Card>
        <Card variant="green">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">LEARNING STARTED</p>
          <p className="mt-3 font-display text-2xl leading-tight">
            {formatTrackerCreatedDate(tracker.createdAt, tracker.timezone)}
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
          <p className="mt-3 break-words font-display text-2xl leading-tight">{tracker.timezone}</p>
        </Card>
      </section>
    </>
  );
}
