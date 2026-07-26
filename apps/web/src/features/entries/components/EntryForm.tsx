import { zodResolver } from '@hookform/resolvers/zod';
import { entryCreationSchema, type EntryCreationInput } from '@openlog/shared';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, NumberInput, Textarea, TextInput } from '../../../components/ui';
import { isApiError, type ApiError } from '../../../lib/api-error';
import type { TrackerEntry } from '../../trackers/api/tracker-api';

const entryFields = [
  'learned',
  'confusedAbout',
  'nextStep',
  'minutesSpent',
  'resourceUrl',
] as const;
type EntryField = (typeof entryFields)[number];

function getEntryErrorMessage(error: ApiError): string {
  return error.code === 'ENTRY_ALREADY_EXISTS'
    ? 'Today already has an entry. Edit the existing entry below.'
    : error.message;
}

type EntryFormProps = {
  initialEntry?: TrackerEntry;
  submitLabel: string;
  isPending: boolean;
  error: ApiError | null;
  onSubmit: (values: EntryCreationInput) => Promise<void>;
  onCancel?: () => void;
};

function getDefaultValues(entry?: TrackerEntry): EntryCreationInput {
  return {
    learned: entry?.learned ?? '',
    confusedAbout: entry?.confusedAbout ?? '',
    nextStep: entry?.nextStep ?? '',
    minutesSpent: entry?.minutesSpent ?? undefined,
    resourceUrl: entry?.resourceUrl ?? '',
  };
}

export function EntryForm({
  initialEntry,
  submitLabel,
  isPending,
  error,
  onSubmit,
  onCancel,
}: EntryFormProps): JSX.Element {
  const form = useForm<EntryCreationInput>({
    resolver: zodResolver(entryCreationSchema),
    defaultValues: getDefaultValues(initialEntry),
  });

  useEffect(() => {
    form.reset(getDefaultValues(initialEntry));
  }, [form, initialEntry]);

  const fieldError = (field: EntryField): string | undefined =>
    form.formState.errors[field]?.message;

  const handleSubmit = async (values: EntryCreationInput): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (submitError: unknown) {
      if (!isApiError(submitError) || !submitError.fieldErrors) return;
      for (const field of entryFields) {
        const message = submitError.fieldErrors[field]?.[0];
        if (message) form.setError(field, { type: 'server', message });
      }
    }
  };

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <Textarea
        id={initialEntry ? 'edit-entry-learned' : 'entry-learned'}
        label="WHAT DID YOU LEARN?"
        placeholder="Explain the idea in your own words."
        required
        error={fieldError('learned')}
        {...form.register('learned')}
      />
      <Textarea
        id={initialEntry ? 'edit-entry-confused' : 'entry-confused'}
        label="WHAT IS STILL UNCLEAR?"
        placeholder="Name the question you are carrying forward."
        helperText="Optional. Maximum 500 characters."
        error={fieldError('confusedAbout')}
        {...form.register('confusedAbout')}
      />
      <Textarea
        id={initialEntry ? 'edit-entry-next' : 'entry-next'}
        label="WHAT WILL YOU DO NEXT?"
        placeholder="Choose the next concrete step."
        helperText="Optional. Maximum 500 characters."
        error={fieldError('nextStep')}
        {...form.register('nextStep')}
      />
      <NumberInput
        id={initialEntry ? 'edit-entry-minutes' : 'entry-minutes'}
        label="HOW LONG DID YOU SPEND?"
        placeholder="45"
        min={1}
        max={1440}
        inputMode="numeric"
        helperText="Optional. 1 to 1,440 minutes."
        error={fieldError('minutesSpent')}
        {...form.register('minutesSpent', {
          setValueAs: (value: unknown) => (value === '' ? undefined : Number(value)),
        })}
      />
      <TextInput
        id={initialEntry ? 'edit-entry-resource' : 'entry-resource'}
        label="RESOURCE LINK"
        type="url"
        placeholder="https://example.com/notes"
        helperText="Optional. HTTP or HTTPS only."
        error={fieldError('resourceUrl')}
        {...form.register('resourceUrl')}
      />
      {error ? (
        <p className="border-[3px] border-border bg-danger p-3 font-bold" role="alert">
          {getEntryErrorMessage(error)}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isPending}>
          {isPending ? 'Saving entry' : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
