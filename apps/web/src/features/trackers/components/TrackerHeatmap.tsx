import type { TrackerActivityDay } from '../api/tracker-api';

type TrackerHeatmapProps = { days: TrackerActivityDay[] };

export function TrackerHeatmap({ days }: TrackerHeatmapProps): JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1.5" aria-label="Tracker activity heatmap" role="img">
      {days.map((day) => (
        <span
          key={day.date}
          title={`${day.date}${day.active ? ' active' : ''}`}
          className={`aspect-square border-2 border-border ${day.active ? 'bg-green' : 'bg-muted'}`}
        />
      ))}
    </div>
  );
}
