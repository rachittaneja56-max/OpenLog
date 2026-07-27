import { useToast } from '../../../app/providers';
import { Button, Card } from '../../../components/ui';
import { useClaimTracker } from '../hooks';

type ClaimTrackerFormProps = {
  slug: string;
  onClaimed: () => void;
};

export function ClaimTrackerForm({ slug, onClaimed }: ClaimTrackerFormProps): JSX.Element {
  const toast = useToast();
  const claim = useClaimTracker();

  const claimForSignedInUser = async (): Promise<void> => {
    try {
      await claim.mutate({ slug });
      toast.notify('This log is now attached to your account.');
      onClaimed();
    } catch {
      // The safe mutation error is rendered below.
    }
  };

  return (
    <Card variant="orange" className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">FOUND YOUR OLD LOG?</p>
      <h1 className="mt-3 text-4xl">Attach it to your account.</h1>
      <p className="mx-auto mt-4 max-w-lg font-medium leading-relaxed">
        The private browser key matches this log. Attach it to your signed-in account to keep
        editing it from your history.
      </p>
      {claim.error ? (
        <p
          className="mt-6 border-[3px] border-border bg-danger p-3 text-left font-bold"
          role="alert"
        >
          {claim.error.message}
        </p>
      ) : null}
      <Button
        className="mt-7"
        loading={claim.isPending}
        onClick={() => void claimForSignedInUser()}
      >
        {claim.isPending ? 'ATTACHING LOG' : 'ATTACH THIS LOG'}
      </Button>
    </Card>
  );
}
