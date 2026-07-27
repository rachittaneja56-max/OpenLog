import { Check, Copy } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { copyTextToClipboard } from '../../lib/copy-to-clipboard';
import { IconButton } from './controls';

type CopyButtonProps = Omit<ComponentPropsWithoutRef<typeof IconButton>, 'label' | 'children'> & {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = 'Copy link', ...props }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const copyValue = async (): Promise<void> => {
    try {
      await copyTextToClipboard(value);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <IconButton
        label={copied ? 'Copied' : copyFailed ? 'Copy unavailable' : label}
        title={copied ? 'Copied' : copyFailed ? 'Copy unavailable' : label}
        onClick={copyValue}
        {...props}
      >
        {copied ? (
          <Check aria-hidden="true" size={18} strokeWidth={3} />
        ) : (
          <Copy aria-hidden="true" size={18} strokeWidth={3} />
        )}
      </IconButton>
      {copyFailed ? (
        <span
          className="border-2 border-border bg-danger px-2 py-1 font-mono text-[10px] font-bold uppercase"
          role="status"
        >
          COPY FAILED
        </span>
      ) : null}
    </span>
  );
}
