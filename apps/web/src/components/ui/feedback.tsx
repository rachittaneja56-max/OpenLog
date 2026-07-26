import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button } from './controls';
import { cn } from '../../lib/cn';

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('neo-card bg-surface text-center', className)}>
      <Inbox aria-hidden="true" className="mx-auto mb-4" size={36} strokeWidth={3} />
      <h3 className="text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md font-medium">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('neo-card bg-danger', className)} role="alert">
      <AlertTriangle aria-hidden="true" className="mb-4" size={36} strokeWidth={3} />
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-3 font-medium">{description}</p>
      {onRetry ? (
        <Button className="mt-6 bg-surface" variant="ghost" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingBlock({
  label = 'Loading',
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { label?: string }): JSX.Element {
  return (
    <div
      className={cn('neo-card flex min-h-32 items-center justify-center bg-muted', className)}
      aria-busy="true"
      {...props}
    >
      <div className="flex items-center gap-3 font-mono text-sm font-bold uppercase" role="status">
        <LoaderCircle aria-hidden="true" className="animate-spin" size={24} />
        {label}
      </div>
    </div>
  );
}

export function Toast({
  message,
  visible = true,
  onDismiss,
  className,
}: {
  message: string;
  visible?: boolean;
  onDismiss?: () => void;
  className?: string;
}): JSX.Element | null {
  if (!visible) return null;
  return (
    <div className={cn('neo-toast bg-green', className)} role="status" aria-live="polite">
      <span>{message}</span>
      {onDismiss ? (
        <button
          type="button"
          className="font-mono text-xs font-bold uppercase underline"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
