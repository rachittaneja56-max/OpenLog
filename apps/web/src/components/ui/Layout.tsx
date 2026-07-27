import { ArrowRight, LogOut } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthMe, useLogout } from '../../features/auth/hooks';
import { IconButton } from './controls';

export function Layout(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuthMe();
  const logout = useLogout();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    auth.refetch();
  }, [auth.refetch, location.pathname]);

  const signOut = async (): Promise<void> => {
    try {
      await logout.mutate(undefined);
      navigate('/login');
    } catch {
      // The safe mutation error is handled by the protected page when needed.
    }
  };

  const signInPath =
    location.pathname === '/login'
      ? '/login'
      : '/login?returnTo=' + encodeURIComponent(location.pathname + location.search);

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
          <div className="flex flex-wrap items-center justify-end gap-3 font-mono text-xs font-bold uppercase tracking-widest md:gap-5">
            <a
              href="/#how-it-works"
              className="hidden underline-offset-4 hover:underline sm:inline"
            >
              How it works
            </a>
            <a href="/#demo" className="hidden underline-offset-4 hover:underline sm:inline">
              Demo
            </a>
            {auth.data?.authenticated ? (
              <div className="flex items-center border-[3px] border-border bg-purple p-1 shadow-neo-sm">
                <Link
                  to="/history"
                  className="inline-flex min-w-0 items-center gap-2 px-1 py-1"
                  aria-label={'Open logs for ' + auth.data.user.username}
                >
                  <span
                    className="inline-flex size-8 shrink-0 items-center justify-center border-2 border-border bg-surface font-mono text-[10px] font-bold"
                    aria-hidden="true"
                  >
                    {auth.data.user.username.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">
                    {auth.data.user.username}
                  </span>
                </Link>
                <IconButton
                  label="Sign out"
                  size="small"
                  className="border-2 bg-surface px-2 py-2 shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none"
                  disabled={logout.isPending}
                  aria-busy={logout.isPending || undefined}
                  onClick={() => void signOut()}
                >
                  <LogOut aria-hidden="true" size={16} strokeWidth={3} />
                </IconButton>
              </div>
            ) : (
              <Link
                to={signInPath}
                className="neo-button inline-flex items-center bg-surface px-3 py-2 shadow-neo-sm"
              >
                Sign in
              </Link>
            )}
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
          <p className="font-mono uppercase tracking-widest">Public logs. Private edit access.</p>
        </div>
      </footer>
    </div>
  );
}
