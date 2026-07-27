import { zodResolver } from '@hookform/resolvers/zod';
import { trackerCreationSchema, type TrackerCreationInput } from '@openlog/shared';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../app/providers';
import { Button, Card, Textarea, TextInput } from '../../../components/ui';
import { isApiError } from '../../../lib/api-error';
import { useAuthMe } from '../../auth/hooks';
import { useCreateTracker } from '../hooks/use-create-tracker';

const trackerFields = ['displayName', 'topic', 'description', 'timezone'] as const;

type TrackerField = (typeof trackerFields)[number];

function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function TrackerCreationForm(): JSX.Element {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuthMe();
  const creation = useCreateTracker();
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
      toast.notify(
        isAuthenticated
          ? 'Your log is live and ready to edit.'
          : 'Your log is live. Sign in to edit and keep it in your history.'
      );

      if (isAuthenticated) {
        navigate(result.dashboardPath);
      } else {
        navigate('/login?returnTo=' + encodeURIComponent(result.dashboardPath));
      }
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
