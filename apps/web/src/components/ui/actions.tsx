import { Check, Copy } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { copyTextToClipboard } from '../../lib/copy-to-clipboard';
import { IconButton } from './controls';

export function CopyButton({
  value,
  label = 'Copy link',
  ...props
}: Omit<ComponentPropsWithoutRef<typeof IconButton>, 'label' | 'children'> & {
  value: string;
  label?: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copyValue = async (): Promise<void> => {
    try {
      await copyTextToClipboard(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <IconButton label={copied ? 'Copied' : label} onClick={copyValue} {...props}>
      {copied ? (
        <Check aria-hidden="true" size={18} strokeWidth={3} />
      ) : (
        <Copy aria-hidden="true" size={18} strokeWidth={3} />
      )}
    </IconButton>
  );
}
