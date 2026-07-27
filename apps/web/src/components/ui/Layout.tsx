import { ArrowRight } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export function Layout(): JSX.Element {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b-[3px] border-border bg-yellow px-5 py-4 md:px-10">
        <nav
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"
          aria-label="Primary navigation"
        >
          <Link to="/" className="font-display text-2xl uppercase tracking-widest text-foreground">
            OpenLog
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-4 font-mono text-xs font-bold uppercase tracking-widest md:gap-6">
            <a
              href="/#how-it-works"
              className="hidden underline-offset-4 hover:underline sm:inline"
            >
              How it works
            </a>
            <a href="/#demo" className="hidden underline-offset-4 hover:underline sm:inline">
              Demo
            </a>
            <a
              href="/#create-log"
              className="neo-button inline-flex items-center gap-2 bg-green px-3 py-2 shadow-neo-sm"
            >
              Start a log <ArrowRight aria-hidden="true" size={15} strokeWidth={3} />
            </a>
          </div>
        </nav>
      </header>
      <main className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <footer className="border-t-[3px] border-border bg-surface px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <p className="font-mono font-bold">OpenLog &copy; {new Date().getFullYear()}</p>
          <p className="font-mono uppercase tracking-widest">No login. No hiding.</p>
        </div>
      </footer>
    </div>
  );
}
