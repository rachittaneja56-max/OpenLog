import { ExternalLink } from 'lucide-react';
import { Badge } from '../../../components/ui';
import type { TrackerEntry } from '../api/tracker-api';
import { formatEntryDate } from '../../entries/utils';

const entryAccents = ['bg-green', 'bg-blue', 'bg-pink', 'bg-yellow'] as const;

type PublicEntryCardProps = {
  entry: TrackerEntry;
  index: number;
};

export function PublicEntryCard({ entry, index }: PublicEntryCardProps): JSX.Element {
  return (
    <article
      id={`entry-${entry.id}`}
      tabIndex={-1}
      className={`neo-box p-5 outline-none md:p-8 ${entryAccents[index % entryAccents.length]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            ENTRY {String(index + 1).padStart(2, '0')}
            {' \u00b7 '}
            {formatEntryDate(entry.entryDate)}
          </p>
          <h3 className="mt-4 text-3xl md:text-4xl">LEARNING NOTE</h3>
        </div>
        {entry.minutesSpent !== null ? (
          <Badge tone="default">{entry.minutesSpent} MINUTES</Badge>
        ) : null}
      </div>

      <p className="mt-6 max-w-4xl whitespace-pre-wrap text-lg font-bold leading-relaxed md:text-xl">
        {entry.learned}
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {entry.confusedAbout ? (
          <div className="border-t-[3px] border-border pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              STILL FIGURING OUT
            </p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">
              {entry.confusedAbout}
            </p>
          </div>
        ) : null}
        {entry.nextStep ? (
          <div className="border-t-[3px] border-border pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest">NEXT</p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{entry.nextStep}</p>
          </div>
        ) : null}
      </div>

      {entry.resourceUrl ? (
        <a
          className="mt-7 inline-flex max-w-full items-center gap-2 break-all border-2 border-border bg-surface px-3 py-2 font-mono text-xs font-bold uppercase underline"
          href={entry.resourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          RESOURCE <ExternalLink aria-hidden="true" size={15} strokeWidth={3} />
        </a>
      ) : null}
    </article>
  );
}
