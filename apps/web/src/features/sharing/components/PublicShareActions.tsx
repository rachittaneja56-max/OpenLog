import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button, CopyButton } from '../../../components/ui';
import { copyTextToClipboard } from '../../../lib/copy-to-clipboard';

type PublicShareActionsProps = {
  url: string;
  title: string;
  text: string;
};

export function PublicShareActions({ url, title, text }: PublicShareActionsProps): JSX.Element {
  const [status, setStatus] = useState<string | null>(null);

  const share = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setStatus('LOG SHARED.');
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setStatus('SHARING UNAVAILABLE. COPY THE LINK INSTEAD.');
      }
      return;
    }

    try {
      await copyTextToClipboard(url);
      setStatus('LINK COPIED.');
    } catch {
      setStatus('COPY UNAVAILABLE. SELECT THE URL MANUALLY.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" size="small" onClick={share}>
        <Share2 aria-hidden="true" size={17} strokeWidth={3} />
        SHARE LOG
      </Button>
      <CopyButton value={url} label="Copy public link" size="small" />
      {status ? (
        <span className="font-mono text-[10px] font-bold uppercase" role="status">
          {status}
        </span>
      ) : null}
    </div>
  );
}
