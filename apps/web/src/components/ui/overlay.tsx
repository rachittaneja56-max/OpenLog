import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { IconButton } from './controls';
import { cn } from '../../lib/cn';

export function Dialog({
  open,
  title,
  children,
  onClose,
  className,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}): JSX.Element | null {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="neo-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={cn('neo-dialog bg-surface', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="openlog-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b-[3px] border-border pb-4">
          <h2 id="openlog-dialog-title" className="text-2xl">
            {title}
          </h2>
          <IconButton label="Close dialog" size="small" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={3} />
          </IconButton>
        </div>
        <div className="pt-5">{children}</div>
      </section>
    </div>
  );
}
