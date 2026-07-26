import { ExternalLink, Pencil } from 'lucide-react';
import { Button } from '../../../components/ui';
import { formatEntryDate } from '../utils';
import type { TrackerEntry } from '../../trackers/api/tracker-api';

type EntryCardProps = {
  entry: TrackerEntry;

  onEdit: (entry: TrackerEntry) => void;
  onDelete: (entry: TrackerEntry) => void;
};

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps): JSX.Element {
  return (
    <article
      id={`entry-${entry.id}`}
      tabIndex={-1}
      className="neo-box bg-surface p-5 outline-none md:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">
            {formatEntryDate(entry.entryDate)}
          </p>
          <h3 className="mt-3 text-2xl">Learning entry</h3>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="small" onClick={() => onEdit(entry)}>
            <Pencil aria-hidden="true" size={16} strokeWidth={3} /> Edit
          </Button>
          <Button type="button" variant="danger" size="small" onClick={() => onDelete(entry)}>
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-6 grid gap-5">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
            What was learned
          </p>
          <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{entry.learned}</p>
        </div>
        {entry.confusedAbout ? (
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
              Still unclear
            </p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">
              {entry.confusedAbout}
            </p>
          </div>
        ) : null}
        {entry.nextStep ? (
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Next step</p>
            <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{entry.nextStep}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 font-mono text-xs font-bold uppercase">
          {entry.minutesSpent ? (
            <span className="border-2 border-border bg-yellow px-2 py-1">
              {entry.minutesSpent} min
            </span>
          ) : null}
          {entry.resourceUrl ? (
            <a
              className="inline-flex items-center gap-2 border-2 border-border bg-blue px-2 py-1 underline"
              href={entry.resourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Resource <ExternalLink aria-hidden="true" size={14} strokeWidth={3} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
