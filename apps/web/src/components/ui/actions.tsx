import { Check, Copy } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef } from 'react';
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
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
