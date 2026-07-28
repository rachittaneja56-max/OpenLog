import { ArrowRight, BookOpen, Flame, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, LoadingBlock, StatCard } from '../components/ui';
import { useLogout } from '../features/auth/hooks';
import { useOwnedTrackers } from '../features/history/hooks';
import { formatTrackerCreatedDate } from '../features/trackers/utils';

function formatStreak(value: number): string {
  return String(value).padStart(2, '0');
}

function getDashboardPathFromState(state: unknown): string | null {
  if (!state || typeof state !== 'object' || !('dashboardPath' in state)) return null;

  const dashboardPath = (state as { dashboardPath?: unknown }).dashboardPath;
  return typeof dashboardPath === 'string' && dashboardPath.startsWith('/dashboard/')
    ? dashboardPath
    : null;
}

export function HistoryPage(): JSX.Element {
  const history = useOwnedTrackers();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const signOut = async (): Promise<void> => {
    try {
      await logout.mutate(undefined);
      navigate('/login');
    } catch {
      // The safe mutation error is rendered by the button state below.
    }
  };

  if (history.isLoading && !history.data) {
    return <LoadingBlock label="Loading your history" />;
  }

  if (history.error?.code === 'AUTHENTICATION_REQUIRED') {
    return (
      <Card variant="yellow" className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">MY LOGS</p>
        <h1 className="mt-3 text-4xl">Sign in to see your history.</h1>
        <p className="mx-auto mt-4 max-w-lg font-medium leading-relaxed">
          Your public links stay open to everyone. Editing and history are protected by your
          account.
        </p>
        <Link
          className="neo-button mt-7 inline-flex items-center gap-2 bg-green px-5 py-3"
          to="/login?returnTo=%2Fhistory"
        >
          SIGN IN <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
        </Link>
      </Card>
    );
  }

  if (history.error && !history.data) {
    return (
      <ErrorState
        title="Could not load your history"
        description={history.error.message}
        onRetry={history.refetch}
      />
    );
  }

  const trackers = history.data ?? [];
  const dashboardPathFromState = getDashboardPathFromState(location.state);

  if (trackers.length === 0) {
    return (
      <EmptyState
        title="No logs yet."
        description="Create your first learning log and it will appear here."
        action={
          <Link className="neo-button inline-flex bg-pink px-5 py-3" to="/#create-log">
            START A LOG <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
          </Link>
        }
      />
    );
  }

  const dashboardPath = dashboardPathFromState ?? '/dashboard/' + trackers[0].slug;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 border-b-[3px] border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">OPENLOG HISTORY</p>
          <h1 className="mt-3 text-5xl md:text-7xl">MY LOGS.</h1>
          <p className="mt-4 max-w-2xl font-medium leading-relaxed">
            Every goal you own, with the latest streak snapshot. Pick one to continue the record.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="neo-button inline-flex items-center gap-2 bg-green px-4 py-3 text-sm"
            to={dashboardPath}
          >
            <LayoutDashboard aria-hidden="true" size={17} strokeWidth={3} /> Dashboard
          </Link>
          <Button variant="ghost" loading={logout.isPending} onClick={() => void signOut()}>
            {logout.isPending ? 'SIGNING OUT' : 'SIGN OUT'}
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        {trackers.map((tracker) => (
          <Card key={tracker.slug} variant="purple" className="overflow-hidden p-0">
            <div className="flex flex-col gap-5 border-b-[3px] border-border bg-surface p-5 md:flex-row md:items-start md:justify-between md:p-7">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border-2 border-border bg-green p-2">
                    <BookOpen aria-hidden="true" size={19} strokeWidth={3} />
                  </span>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">
                    {tracker.displayName ?? 'Learning log'}
                  </p>
                </div>
                <h2 className="mt-4 break-words text-3xl md:text-4xl">{tracker.topic}</h2>
                {tracker.description ? (
                  <p className="mt-3 max-w-2xl font-medium leading-relaxed">
                    {tracker.description}
                  </p>
                ) : null}
                <p className="mt-4 break-all font-mono text-xs font-bold uppercase">
                  /learn/{tracker.slug}
                </p>
              </div>
              <Link
                className="neo-button inline-flex shrink-0 items-center justify-center gap-2 bg-yellow px-4 py-3"
                to={'/dashboard/' + tracker.slug}
              >
                OPEN LOG <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
              </Link>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 md:p-7">
              <StatCard
                variant="yellow"
                label="Current streak"
                value={formatStreak(tracker.stats.currentStreak)}
                detail="days"
              />
              <StatCard
                variant="pink"
                label="Longest streak"
                value={tracker.stats.longestStreak}
                detail="days"
              />
              <StatCard
                variant="blue"
                label="Active days"
                value={tracker.stats.totalActiveDays}
                detail="total"
              />
              <StatCard
                variant="orange"
                label="Total minutes"
                value={tracker.stats.totalMinutes}
                detail="logged"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t-[3px] border-border p-5 font-mono text-xs font-bold uppercase md:p-7">
              <Flame aria-hidden="true" size={16} strokeWidth={3} />
              <span>Started {formatTrackerCreatedDate(tracker.createdAt, tracker.timezone)}</span>
              <span className="border-2 border-border bg-surface px-2 py-1">
                {tracker.timezone}
              </span>
              <Link
                className="ml-auto underline-offset-4 hover:underline"
                to={'/learn/' + tracker.slug}
              >
                View public page
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
