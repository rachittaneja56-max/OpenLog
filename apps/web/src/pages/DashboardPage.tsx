import { buildActivityMonthLabels, type EntryCreationInput } from '@openlog/shared';
import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '../app/providers';
import { ClaimTrackerForm } from '../features/auth/components';
import {
  Button,
  Card,
  CopyButton,
  Dialog,
  ErrorState,
  LoadingBlock,
  SectionHeading,
  StatCard,
} from '../components/ui';
import { EntryForm, EntryHistory } from '../features/entries/components';
import { scrollToEntry } from '../features/entries/utils';
import { useCreateEntry, useDeleteEntry, useUpdateEntry } from '../features/entries/hooks';
import type { UpdateEntryInput } from '../features/entries/api/entry-api';
import { DashboardHeader, GoalSummary, TrackerHeatmap } from '../features/trackers/components';
import type { TrackerEntry } from '../features/trackers/api/tracker-api';
import { useOwnerDashboard } from '../features/trackers/hooks';

function toUpdateInput(values: EntryCreationInput): UpdateEntryInput {
  return {
    learned: values.learned,
    confusedAbout: values.confusedAbout?.trim() ? values.confusedAbout : null,
    nextStep: values.nextStep?.trim() ? values.nextStep : null,
    minutesSpent: values.minutesSpent ?? null,
    resourceUrl: values.resourceUrl?.trim() ? values.resourceUrl : null,
  };
}

function AccessGate({
  publicPath,
  loginPath,
  onRetry,
}: {
  publicPath: string;
  loginPath: string;
  onRetry: () => void;
}): JSX.Element {
  return (
    <Card variant="orange" className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">PRIVATE EDIT ACCESS</p>
      <h1 className="mt-3 text-4xl">Sign in to edit this log.</h1>
      <p className="mx-auto mt-4 max-w-lg font-medium leading-relaxed">
        Public learning logs are open to everyone. Editing is reserved for the account that owns
        this log.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link className="neo-button inline-flex items-center bg-green px-4 py-3" to={loginPath}>
          Sign in to edit
        </Link>
        <Link className="neo-button inline-flex items-center bg-surface px-4 py-3" to={publicPath}>
          View public log
        </Link>
        <Button variant="ghost" onClick={onRetry}>
          Check access again
        </Button>
      </div>
    </Card>
  );
}

export function DashboardPage(): JSX.Element {
  const { slug = '' } = useParams();
  const dashboard = useOwnerDashboard(slug);
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry();
  const deleteMutation = useDeleteEntry();
  const toast = useToast();
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<TrackerEntry | null>(null);
  const publicPath = `/learn/${slug}`;
  const publicUrl = useMemo(() => `${window.location.origin}${publicPath}`, [publicPath]);
  const monthLabels = useMemo(
    () => buildActivityMonthLabels(dashboard.tracker?.heatmap ?? []),
    [dashboard.tracker?.heatmap]
  );
  const entryIdsByDate = useMemo(
    () =>
      Object.fromEntries(
        (dashboard.tracker?.entries ?? []).map((entry) => [entry.entryDate, entry.id])
      ),
    [dashboard.tracker?.entries]
  );
  const selectEntryDate = useCallback(
    (date: string): void => {
      const entryId = entryIdsByDate[date];
      if (!entryId) return;
      scrollToEntry(entryId);
    },
    [entryIdsByDate]
  );

  const createTodayEntry = async (values: EntryCreationInput): Promise<void> => {
    await createMutation.mutate({ slug, input: values });
    await dashboard.refreshTracker();
    toast.notify("Today's learning is logged.");
  };

  const updateExistingEntry = async (values: EntryCreationInput): Promise<void> => {
    if (!editingEntry) return;
    await updateMutation.mutate({ slug, entryId: editingEntry.id, input: toUpdateInput(values) });
    await dashboard.refreshTracker();
    setEditingEntry(null);
    toast.notify('Entry updated.');
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deletingEntry) return;
    await deleteMutation.mutate({ slug, entryId: deletingEntry.id });
    await dashboard.refreshTracker();
    setDeletingEntry(null);
    toast.notify('Entry deleted.');
  };

  if (dashboard.isTrackerLoading && !dashboard.tracker) {
    return <LoadingBlock label="Loading dashboard" />;
  }
  if (dashboard.trackerError && !dashboard.tracker) {
    return (
      <ErrorState description={dashboard.trackerError.message} onRetry={dashboard.refreshTracker} />
    );
  }
  if (dashboard.isAccessLoading) {
    return <LoadingBlock label="Checking owner access" />;
  }
  if (dashboard.accessError) {
    return (
      <ErrorState
        title="Could not verify owner access"
        description={dashboard.accessError.message}
        onRetry={dashboard.refetchAccess}
      />
    );
  }
  if (dashboard.access?.canClaim) {
    return <ClaimTrackerForm slug={slug} onClaimed={dashboard.refetchAccess} />;
  }
  if (!dashboard.isOwner) {
    const loginPath = '/login?returnTo=' + encodeURIComponent('/dashboard/' + slug);
    return (
      <AccessGate publicPath={publicPath} loginPath={loginPath} onRetry={dashboard.refetchAccess} />
    );
  }
  if (!dashboard.tracker) {
    return (
      <ErrorState description="This tracker is not available." onRetry={dashboard.refreshTracker} />
    );
  }

  const tracker = dashboard.tracker;

  return (
    <div className="space-y-8">
      <DashboardHeader publicPath={publicPath} publicUrl={publicUrl} />
      <GoalSummary
        displayName={tracker.displayName}
        topic={tracker.topic}
        description={tracker.description}
        createdAt={tracker.createdAt}
        timezone={tracker.timezone}
      />

      <section
        className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        aria-labelledby="today-entry-heading"
      >
        {tracker.stats.hasLoggedToday ? (
          <Card variant="green">
            <SectionHeading id="today-entry-heading" eyebrow="TODAY COMPLETE">
              TODAY'S ENTRY
            </SectionHeading>
            <p className="mt-5 text-2xl font-bold uppercase">You showed up today.</p>
            <p className="mt-3 font-medium leading-relaxed">
              Your latest note is part of the public record. Edit it below whenever you need to
              refine the thought.
            </p>
          </Card>
        ) : (
          <Card variant="green">
            <SectionHeading id="today-entry-heading" eyebrow="LOG TODAY TO CONTINUE">
              TODAY'S ENTRY
            </SectionHeading>
            <p className="mb-7 mt-4 font-medium">
              Write down the useful thing before the day gets away.
            </p>
            <EntryForm
              submitLabel="LOG TODAY'S LEARNING"
              isPending={createMutation.isPending}
              pendingLabel="LOGGING TODAY'S LEARNING"
              error={createMutation.error}
              onSubmit={createTodayEntry}
            />
          </Card>
        )}
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard
              variant="yellow"
              label="Current streak"
              value={tracker.stats.currentStreak}
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
              label="Total learning days"
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
          <Card>
            <p className="font-mono text-xs font-bold uppercase tracking-widest">Activity</p>
            <p className="mt-2 font-medium">Your last 12 weeks, one square per calendar day.</p>
            <div className="mt-5">
              <TrackerHeatmap
                days={tracker.heatmap}
                monthLabels={monthLabels}
                onSelectDate={selectEntryDate}
              />
            </div>
          </Card>
        </div>
      </section>

      <EntryHistory
        entries={tracker.entries}
        onEdit={setEditingEntry}
        onDelete={setDeletingEntry}
      />

      <Card variant="blue">
        <SectionHeading eyebrow="Ready to share">PUBLIC LINK</SectionHeading>
        <p className="mt-4 font-medium">
          Anyone with this link can see your goal and daily learning record.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 break-all border-[3px] border-border bg-surface p-3 font-mono text-sm">
            {publicUrl}
          </code>
          <CopyButton
            value={publicUrl}
            label="Copy public link"
            className="bg-yellow self-start sm:self-auto"
          />
        </div>
      </Card>

      <Dialog
        open={editingEntry !== null}
        title="Edit learning entry"
        onClose={() => setEditingEntry(null)}
      >
        <EntryForm
          initialEntry={editingEntry ?? undefined}
          submitLabel="SAVE CHANGES"
          isPending={updateMutation.isPending}
          pendingLabel="SAVING CHANGES"
          error={updateMutation.error}
          onSubmit={updateExistingEntry}
          onCancel={() => setEditingEntry(null)}
        />
      </Dialog>

      <Dialog
        open={deletingEntry !== null}
        title="Delete this entry?"
        onClose={() => setDeletingEntry(null)}
      >
        <p className="font-medium">
          This removes the entry from the public log. The action cannot be undone.
        </p>
        {deleteMutation.error ? (
          <p className="mt-5 border-[3px] border-border bg-danger p-3 font-bold" role="alert">
            {deleteMutation.error.message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => void confirmDelete()}
          >
            {deleteMutation.isPending ? 'DELETING ENTRY' : 'DELETE ENTRY'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setDeletingEntry(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
