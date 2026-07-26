import { ArrowRight, Check, Flame, Globe2, Plus } from 'lucide-react';

export function LandingPage(): JSX.Element {
  return (
    <div className="space-y-10 md:space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="neo-box bg-purple p-7 md:p-12">
          <p className="mb-6 font-mono text-sm font-bold uppercase tracking-widest">
            The public learning log
          </p>
          <h1 className="max-w-4xl text-5xl leading-[0.95] md:text-7xl">
            Make learning impossible to hide.
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed md:text-xl">
            OpenLog is a simple place to show up, learn in public, and build a streak one day at a
            time.
          </p>
          <div className="mt-9 inline-flex cursor-not-allowed items-center gap-3 border-[3px] border-border bg-green px-5 py-4 font-bold uppercase shadow-neo opacity-80">
            <Plus aria-hidden="true" size={22} strokeWidth={3} />
            Start a tracker <span className="font-mono text-xs">(next phase)</span>
          </div>
        </div>

        <div className="neo-box flex flex-col justify-between bg-yellow p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="border-[3px] border-border bg-surface px-3 py-2 font-mono text-xs font-bold uppercase">
              Example log
            </span>
            <Flame aria-hidden="true" size={38} strokeWidth={3} />
          </div>
          <div className="mt-12">
            <p className="font-mono text-sm font-bold uppercase tracking-widest">Current streak</p>
            <p className="font-display text-8xl leading-none md:text-9xl">07</p>
            <p className="mt-3 font-mono font-bold uppercase">days of system design</p>
          </div>
          <div className="mt-10 grid grid-cols-7 gap-2" aria-label="Example activity heatmap">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <span
                key={day}
                className={`aspect-square border-2 border-border ${day < 5 ? 'bg-green' : 'bg-surface'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="neo-box bg-blue p-6 md:p-8">
          <Flame aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Build a streak</h2>
          <p className="font-medium leading-relaxed">
            Turn tiny daily sessions into visible momentum.
          </p>
        </div>
        <div className="neo-box bg-pink p-6 md:p-8">
          <Globe2 aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Share the work</h2>
          <p className="font-medium leading-relaxed">
            One public link makes your learning journey easy to follow.
          </p>
        </div>
        <div className="neo-box bg-orange p-6 md:p-8">
          <Check aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Keep it frictionless</h2>
          <p className="font-medium leading-relaxed">
            No account maze. Just a focused space for showing up.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-6 border-y-[3px] border-border py-7 md:flex-row md:items-center">
        <p className="font-mono text-sm font-bold uppercase tracking-widest">
          A starter scaffold for a better learning habit.
        </p>
        <span className="inline-flex items-center gap-2 font-bold uppercase">
          Coming next <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
        </span>
      </section>
    </div>
  );
}
