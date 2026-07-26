import type { ActivityDay, ActivityMonthLabel } from '@openlog/shared';
import { useState } from 'react';

const levelClasses: Record<ActivityDay['level'], string> = {
  0: 'bg-muted',
  1: 'bg-green',
  2: 'bg-yellow',
  3: 'bg-orange',
  4: 'bg-pink',
};

const weekdayHints = ['SUN', '', 'MON', '', 'WED', '', 'FRI'];

type TrackerHeatmapProps = {
  days: readonly ActivityDay[];
  monthLabels: readonly ActivityMonthLabel[];
  onSelectDate?: (date: string) => void;
};

function describeDay(day: ActivityDay): string {
  if (day.count === 0) return `${day.date}: no activity`;
  return `${day.date}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}, activity level ${day.level} of 4`;
}

export function TrackerHeatmap({
  days,
  monthLabels,
  onSelectDate,
}: TrackerHeatmapProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectDate = (day: ActivityDay): void => {
    if (day.count === 0) return;
    setSelectedDate(day.date);
    onSelectDate?.(day.date);
  };

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[34rem]">
          <div className="relative mb-2 ml-9 h-4 font-mono text-[10px] font-bold uppercase">
            {monthLabels.map((month) => (
              <span
                key={month.key}
                className="absolute truncate"
                style={{ left: `${(month.weekIndex / 12) * 100}%` }}
              >
                {month.label}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="grid w-7 shrink-0 grid-rows-7 gap-1.5 font-mono text-[9px] font-bold leading-none text-foreground/70">
              {weekdayHints.map((hint, index) => (
                <span key={`${hint}-${index}`} className="flex items-center">
                  {hint}
                </span>
              ))}
            </div>
            <div className="grid min-w-0 flex-1 grid-flow-col grid-rows-7 gap-1.5 [grid-template-columns:repeat(12,minmax(0,1fr))]">
              {days.map((day) => {
                const active = day.count > 0;
                const selected = selectedDate === day.date;
                return (
                  <button
                    key={day.date}
                    type="button"
                    className={`aspect-square min-w-0 border-2 border-border ${levelClasses[day.level]} ${active ? 'cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]' : 'cursor-default opacity-75'} ${selected ? 'ring-4 ring-purple ring-offset-1' : ''}`}
                    aria-label={describeDay(day)}
                    aria-pressed={active ? selected : undefined}
                    disabled={!active}
                    title={describeDay(day)}
                    onClick={() => selectDate(day)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase"
        aria-label="Activity levels"
      >
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className="flex items-center gap-1" title={`Level ${level}`}>
            <span
              className={`inline-flex h-4 w-4 items-center justify-center border-2 border-border text-[9px] ${levelClasses[level as ActivityDay['level']]}`}
            >
              {level}
            </span>
          </span>
        ))}
        <span>More</span>
      </div>
      <p className="mt-3 font-mono text-[10px] font-bold uppercase text-foreground/70">
        Active cells are keyboard-focusable. Select one to locate its entry.
      </p>
    </div>
  );
}
