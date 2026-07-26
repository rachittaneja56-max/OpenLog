import { Link, Outlet } from 'react-router-dom';

export function Layout(): JSX.Element {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b-[3px] border-border bg-yellow px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="font-display text-2xl uppercase tracking-widest text-foreground">
            OpenLog
          </Link>
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            Learn out loud
          </span>
        </div>
      </header>
      <main className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <footer className="border-t-[3px] border-border bg-surface px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between">
          <p className="font-mono font-bold">OpenLog © {new Date().getFullYear()}</p>
          <p className="font-mono uppercase tracking-widest">Small steps. Visible progress.</p>
        </div>
      </footer>
    </div>
  );
}
