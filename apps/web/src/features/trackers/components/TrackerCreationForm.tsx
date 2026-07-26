import { zodResolver } from '@hookform/resolvers/zod';
import { trackerCreationSchema, type TrackerCreationInput } from '@openlog/shared';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Textarea, TextInput } from '../../../components/ui';
import { useCreateTracker } from '../hooks/use-create-tracker';

function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function TrackerCreationForm(): JSX.Element {
  const navigate = useNavigate();
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

  const onSubmit = async (values: TrackerCreationInput): Promise<void> => {
    try {
      const result = await creation.mutate(values);
      navigate(result.dashboardPath);
    } catch {
      // The mutation hook already stores a safe, user-facing ApiError.
    }
  };

  return (
    <Card variant="green" className="mx-auto max-w-3xl">
      <div className="mb-7">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">
          Create your first log
        </p>
        <h2 className="mt-2 text-3xl">Start learning in public</h2>
        <p className="mt-3 font-medium">
          No account or password. Your browser receives a private owner cookie.
        </p>
      </div>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextInput
          id="tracker-display-name"
          label="Display name"
          placeholder="Rachitâ€™s System Design"
          helperText="Optional. Maximum 60 characters."
          error={form.formState.errors.displayName?.message}
          {...form.register('displayName')}
        />
        <TextInput
          id="tracker-topic"
          label="Topic"
          placeholder="System Design"
          required
          error={form.formState.errors.topic?.message}
          {...form.register('topic')}
        />
        <Textarea
          id="tracker-description"
          label="Description"
          placeholder="What are you learning and why?"
          helperText="Optional. Maximum 300 characters."
          error={form.formState.errors.description?.message}
          {...form.register('description')}
        />
        <TextInput
          id="tracker-timezone"
          label="Timezone"
          helperText="Used later to calculate daily entries correctly."
          error={form.formState.errors.timezone?.message}
          {...form.register('timezone')}
        />
        {creation.error ? (
          <p className="border-[3px] border-border bg-danger p-3 font-bold" role="alert">
            {creation.error.message}
          </p>
        ) : null}
        <Button type="submit" loading={creation.isPending} className="justify-self-start">
          {creation.isPending ? 'Creating tracker' : 'Create tracker'}
        </Button>
      </form>
    </Card>
  );
}
