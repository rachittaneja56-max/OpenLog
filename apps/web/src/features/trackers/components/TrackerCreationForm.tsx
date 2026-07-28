import { zodResolver } from '@hookform/resolvers/zod';
import { trackerCreationSchema, type TrackerCreationInput } from '@openlog/shared';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../app/providers';
import { Badge, Button, Card, Textarea, TextInput } from '../../../components/ui';
import { isApiError } from '../../../lib/api-error';
import { useAuthMe } from '../../auth/hooks';
import { PublicShareActions } from '../../sharing/components';
import type { CreatedTracker } from '../api/tracker-api';
import { useCreateTracker } from '../hooks/use-create-tracker';

const trackerFields = ['displayName', 'topic', 'description', 'timezone'] as const;

type TrackerField = (typeof trackerFields)[number];

function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function TrackerCreatedCard({ result }: { result: CreatedTracker }): JSX.Element {
  const publicUrl = `${window.location.origin}${result.publicPath}`;
  const loginPath = '/login?returnTo=' + encodeURIComponent(result.dashboardPath);

  return (
    <Card
      id="create-log"
      variant="green"
      className="mx-auto w-full max-w-xl scroll-mt-8 p-6 md:p-8"
      role="status"
    >
      <Badge tone="yellow">Public link ready</Badge>
      <h2 className="mt-5 text-4xl">Your log is live.</h2>
      <p className="mt-4 font-medium leading-relaxed">
        Your page for <strong>{result.tracker.topic}</strong> is public and ready to share. Anyone
        with the link can view it without an account.
      </p>

      <div className="mt-6 border-[3px] border-border bg-surface p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Public URL</p>
        <p className="mt-2 break-all font-mono text-sm font-bold">{publicUrl}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="neo-button inline-flex items-center gap-2 bg-yellow px-4 py-3"
          to={result.publicPath}
        >
          VIEW PUBLIC LOG <ExternalLink aria-hidden="true" size={17} strokeWidth={3} />
        </Link>
        <Link
          className="neo-button inline-flex items-center gap-2 bg-surface px-4 py-3"
          to={loginPath}
        >
          SIGN IN TO ADD ENTRIES <ArrowRight aria-hidden="true" size={17} strokeWidth={3} />
        </Link>
      </div>

      <div className="mt-5 border-t-2 border-border pt-5">
        <PublicShareActions
          url={publicUrl}
          title={`${result.tracker.topic} - OpenLog`}
          text={`Follow my progress learning ${result.tracker.topic}.`}
        />
      </div>

      <p className="mt-5 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-wide">
        Viewing stays public. Signing in is only needed to write entries and keep this log in My
        Logs.
      </p>
    </Card>
  );
}

export function TrackerCreationForm(): JSX.Element {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuthMe();
  const creation = useCreateTracker();
  const [createdTracker, setCreatedTracker] = useState<CreatedTracker | null>(null);
  const form = useForm<TrackerCreationInput>({
    resolver: zodResolver(trackerCreationSchema),
    defaultValues: {
      displayName: '',
      topic: '',
      description: '',
      timezone: getTimezone(),
    },
  });
  const isAuthenticated = auth.data?.authenticated === true;
  const isCheckingAuth = auth.isLoading && !auth.data;

  const onSubmit = async (values: TrackerCreationInput): Promise<void> => {
    try {
      const result = await creation.mutate(values);

      if (isAuthenticated) {
        toast.notify('Your log is live and ready to edit.');
        navigate(result.dashboardPath);
        return;
      }

      setCreatedTracker(result);
      toast.notify('Your public log is live. Open or copy the link below.');
    } catch (error: unknown) {
      if (!isApiError(error) || !error.fieldErrors) return;
      for (const field of trackerFields) {
        const message = error.fieldErrors[field]?.[0];
        if (message) form.setError(field, { type: 'server', message });
      }
    }
  };

  const errorMessage = creation.error?.message;
  const fieldError = (field: TrackerField): string | undefined =>
    form.formState.errors[field]?.message;

  if (createdTracker) {
    return <TrackerCreatedCard result={createdTracker} />;
  }

  return (
    <Card
      id="create-log"
      variant="yellow"
      className="mx-auto w-full max-w-xl scroll-mt-8 p-6 md:p-8"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">Create your log</p>
          <h2 className="mt-2 text-3xl">Start with one goal.</h2>
        </div>
        <span className="border-2 border-border bg-green px-2 py-1 font-mono text-[10px] font-bold uppercase">
          Free
        </span>
      </div>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextInput
          id="tracker-display-name"
          label="Display name"
          placeholder="Rachit's System Design"
          helperText="Optional. Maximum 60 characters."
          error={fieldError('displayName')}
          {...form.register('displayName')}
        />
        <TextInput
          id="tracker-topic"
          label="What are you learning?"
          placeholder="System Design"
          required
          error={fieldError('topic')}
          {...form.register('topic')}
        />
        <Textarea
          id="tracker-description"
          label="Short description"
          placeholder="The concepts I am working through this season."
          helperText="Optional. Maximum 300 characters."
          error={fieldError('description')}
          {...form.register('description')}
        />
        <TextInput
          id="tracker-timezone"
          label="Timezone"
          helperText="Detected from your browser. You can change it."
          error={fieldError('timezone')}
          {...form.register('timezone')}
        />
        {errorMessage ? (
          <p className="border-[3px] border-border bg-danger p-3 font-bold" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <Button
          type="submit"
          loading={creation.isPending || isCheckingAuth}
          disabled={isCheckingAuth}
          className="w-full"
        >
          {isCheckingAuth
            ? 'Checking access'
            : creation.isPending
              ? 'Creating your log'
              : 'Start my log \u2192'}
        </Button>
        <p className="text-center font-mono text-[11px] font-bold uppercase tracking-wide">
          PUBLIC LOG / SIGN IN TO EDIT
        </p>
      </form>
    </Card>
  );
}
