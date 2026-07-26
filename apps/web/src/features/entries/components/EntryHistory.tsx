import { EntryCard } from './EntryCard';
import type { TrackerEntry } from '../../trackers/api/tracker-api';

type EntryHistoryProps = {
  entries: TrackerEntry[];
  onEdit: (entry: TrackerEntry) => void;
  onDelete: (entry: TrackerEntry) => void;
};

export function EntryHistory({ entries, onEdit, onDelete }: EntryHistoryProps): JSX.Element {
  return (
    <section aria-labelledby="entry-history-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">The record so far</p>
          <h2 id="entry-history-heading" className="mt-2 text-3xl">
            Entry history
          </h2>
        </div>
        <span className="font-mono text-xs font-bold uppercase">{entries.length} active days</span>
      </div>
      {entries.length === 0 ? (
        <div className="neo-box bg-surface p-7">
          <h3 className="text-2xl">No entries yet.</h3>
          <p className="mt-3 font-medium">Your first note will start the public record.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
