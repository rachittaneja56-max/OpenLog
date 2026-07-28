import { BookOpen, Flame, Globe2, Link2, Sparkles } from 'lucide-react';
import { Card, SectionHeading, StatCard, Sticker } from '../components/ui';
import { TrackerCreationForm } from '../features/trackers/components';

const heatmapClasses = [
  'bg-muted',
  'bg-green',
  'bg-green',
  'bg-yellow',
  'bg-green',
  'bg-muted',
  'bg-orange',
  'bg-green',
  'bg-green',
  'bg-yellow',
  'bg-green',
  'bg-green',
  'bg-muted',
  'bg-green',
  'bg-green',
  'bg-orange',
  'bg-green',
  'bg-yellow',
  'bg-green',
  'bg-green',
  'bg-muted',
  'bg-green',
  'bg-green',
  'bg-yellow',
  'bg-green',
  'bg-orange',
  'bg-green',
  'bg-green',
];

const sampleEntries = [
  {
    date: 'DAY 07 Â· TODAY',
    title: 'Designed for failure',
    body: 'Compared retries, timeouts, and circuit breakers as separate tools for making a distributed system more honest about failure.',
    minutes: '42 MIN',
  },
  {
    date: 'DAY 06 Â· YESTERDAY',
    title: 'Queues and backpressure',
    body: 'Mapped how a queue protects a slow consumer, then noted where unbounded queues simply move the outage downstream.',
    minutes: '35 MIN',
  },
  {
    date: 'DAY 05 Â· 2 DAYS AGO',
    title: 'Read replicas',
    body: 'Learned why replicas improve read throughput but do not magically solve consistency or hot partitions.',
    minutes: '28 MIN',
  },
];

function ActivityHeatmap({ compact = false }: { compact?: boolean }): JSX.Element {
  return (
    <div
      className={`grid grid-cols-7 gap-1.5 ${compact ? 'max-w-[11rem]' : 'max-w-xs'}`}
      aria-label="Example learning activity heatmap"
      role="img"
    >
      {heatmapClasses.map((tone, index) => (
        <span key={`${tone}-${index}`} className={`aspect-square border-2 border-border ${tone}`} />
      ))}
    </div>
  );
}

export function LandingPage(): JSX.Element {
  return (
    <div className="landing-page space-y-20 pb-8 md:space-y-28">
      <section
        className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)] lg:items-start xl:gap-16"
        aria-labelledby="hero-heading"
      >
        <div className="min-w-0 lg:pt-6">
          <Sticker tone="green" className="neo-sticker-entrance">
            PUBLIC BY DEFAULT
          </Sticker>
          <h1
            id="hero-heading"
            className="mt-7 max-w-3xl text-6xl leading-[0.88] sm:text-7xl md:text-8xl"
          >
            LEARN IT.
            <br />
            LOG IT.
            <br />
            SHOW IT.
          </h1>
          <p className="mt-8 max-w-xl text-xl font-bold leading-snug md:text-2xl">
            Build a public record of what you learn, one day at a time.
          </p>
          <p className="mt-5 max-w-lg text-base font-medium leading-relaxed md:text-lg">
            OpenLog turns the quiet work of learning into a visible trail. Pick a goal, show up, and
            give people a link to the proof.
          </p>
          <a
            className="neo-button mt-8 inline-flex items-center gap-3 bg-pink px-5 py-4"
            href="#create-log"
          >
            START MY LOG {'\u2192'}
          </a>
          <div className="mt-10 flex flex-col items-start gap-4 border-t-[3px] border-border pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                A little proof, every day
              </p>
              <p className="mt-2 font-mono text-xs font-bold uppercase">Activity at a glance</p>
            </div>
            <ActivityHeatmap compact />
          </div>
        </div>

        <div className="min-w-0 lg:justify-self-end">
          <TrackerCreationForm />
        </div>
      </section>

      <section id="demo" className="scroll-mt-8" aria-labelledby="demo-heading">
        <SectionHeading id="demo-heading" eyebrow="A public log in motion" className="mb-7">
          Your learning, with receipts.
        </SectionHeading>
        <Card variant="purple" className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-border bg-surface p-5 md:p-7">
            <div className="flex min-w-0 items-center gap-3">
              <span className="border-2 border-border bg-green p-2">
                <BookOpen aria-hidden="true" size={20} strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl uppercase">SYSTEM DESIGN</p>
                <p className="break-all font-mono text-xs font-bold uppercase">
                  openlog.dev/learn/rachit-system-design-a7k2
                </p>
              </div>
            </div>
            <span className="border-2 border-border bg-yellow px-3 py-2 font-mono text-xs font-bold uppercase">
              Public log
            </span>
          </div>
          <div className="grid gap-6 p-5 md:grid-cols-[0.8fr_1.2fr] md:p-8">
            <div className="space-y-5">
              <StatCard
                variant="yellow"
                label="Current streak"
                value="07"
                detail="days and counting"
              />
              <div className="border-[3px] border-border bg-surface p-5">
                <p className="font-mono text-xs font-bold uppercase tracking-widest">
                  Activity heatmap
                </p>
                <div className="mt-4">
                  <ActivityHeatmap />
                </div>
              </div>
            </div>
            <div className="border-[3px] border-border bg-surface p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest">
                  07 Â· Today
                </span>
                <span className="border-2 border-border bg-blue px-2 py-1 font-mono text-[10px] font-bold uppercase">
                  42 min
                </span>
              </div>
              <h3 className="mt-8 text-3xl">Designed for failure</h3>
              <p className="mt-4 max-w-xl font-medium leading-relaxed">
                Compared retries, timeouts, and circuit breakers as separate tools for making a
                distributed system more honest about failure.
              </p>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs font-bold uppercase">
                <Link2 aria-hidden="true" size={16} strokeWidth={3} /> Shared in public
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="how-it-works" className="scroll-mt-8" aria-labelledby="how-heading">
        <SectionHeading id="how-heading" eyebrow="Three moves, no ceremony" className="mb-7">
          How it works.
        </SectionHeading>
        <div className="grid gap-6 md:grid-cols-3">
          <Card variant="blue">
            <p className="font-mono text-3xl font-bold">01</p>
            <h3 className="mt-8 text-2xl">CREATE A GOAL</h3>
            <p className="mt-4 font-medium leading-relaxed">
              Name the thing you want to understand and give it a home on the web.
            </p>
          </Card>
          <Card variant="yellow">
            <p className="font-mono text-3xl font-bold">02</p>
            <h3 className="mt-8 text-2xl">LOG WHAT YOU LEARN</h3>
            <p className="mt-4 font-medium leading-relaxed">
              Add one honest entry per day. Small notes count. Momentum counts.
            </p>
          </Card>
          <Card variant="pink">
            <p className="font-mono text-3xl font-bold">03</p>
            <h3 className="mt-8 text-2xl">SHARE THE PROOF</h3>
            <p className="mt-4 font-medium leading-relaxed">
              Send one public link to friends, peers, or the future version of you.
            </p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="sample-heading">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="sample-heading" eyebrow="Sample data Â· System Design">
            A log people can follow.
          </SectionHeading>
          <Sticker tone="orange">SAMPLE PUBLIC LOG</Sticker>
        </div>
        <div className="grid gap-5">
          {sampleEntries.map((entry, index) => (
            <article
              key={entry.date}
              className={`neo-box p-5 md:p-7 ${index === 0 ? 'bg-green' : index === 1 ? 'bg-surface' : 'bg-blue'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">
                    {entry.date}
                  </p>
                  <h3 className="mt-3 text-2xl md:text-3xl">{entry.title}</h3>
                </div>
                <span className="border-2 border-border bg-surface px-2 py-1 font-mono text-xs font-bold uppercase">
                  {entry.minutes}
                </span>
              </div>
              <p className="mt-5 max-w-3xl font-medium leading-relaxed">{entry.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="neo-box bg-orange p-7 md:flex md:items-center md:justify-between md:gap-10 md:p-10"
        aria-labelledby="final-cta-heading"
      >
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            The next session starts now
          </p>
          <h2 id="final-cta-heading" className="mt-3 max-w-2xl text-4xl md:text-5xl">
            Make your learning visible.
          </h2>
        </div>
        <a
          className="neo-button mt-7 inline-flex shrink-0 items-center gap-3 bg-surface px-5 py-4 md:mt-0"
          href="#create-log"
        >
          START MY LOG {'\u2192'}
        </a>
      </section>

      <footer className="flex flex-col gap-3 border-t-[3px] border-border pt-6 font-mono text-xs font-bold uppercase tracking-wide md:flex-row md:items-center md:justify-between">
        <span>OpenLog Â· Learn in public</span>
        <span className="flex items-center gap-2">
          <Flame aria-hidden="true" size={15} strokeWidth={3} /> Public logs. Private edit access.
        </span>
        <span className="flex items-center gap-2">
          <Globe2 aria-hidden="true" size={15} strokeWidth={3} /> Built for the long game{' '}
          <Sparkles aria-hidden="true" size={15} strokeWidth={3} />
        </span>
      </footer>
    </div>
  );
}
