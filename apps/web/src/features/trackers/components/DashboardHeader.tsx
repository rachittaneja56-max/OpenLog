import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card, CopyButton, SectionHeading } from '../../../components/ui';
import { formatTrackerCreatedDate } from '../utils';

type DashboardHeaderProps = { dashboardPath: string; publicPath: string; publicUrl: string };

export function DashboardHeader({
  dashboardPath,
  publicPath,
  publicUrl,
}: DashboardHeaderProps): JSX.Element {
  return (
    <header className="flex flex-col gap-5 border-b-[3px] border-border pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl uppercase tracking-widest">OpenLog</span>
        <Badge tone="green">OWNER VIEW</Badge>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="neo-button inline-flex items-center bg-surface px-3 py-2 text-xs"
          to="/history"
          state={{ dashboardPath }}
        >
          My logs
        </Link>
        <a
          className="neo-button inline-flex items-center gap-2 bg-surface px-3 py-2 text-xs"
          href={publicPath}
          target="_blank"
          rel="noreferrer"
        >
          View public page <ExternalLink aria-hidden="true" size={16} strokeWidth={3} />
        </a>
        <CopyButton value={publicUrl} label="Copy public link" className="bg-yellow" />
      </div>
    </header>
  );
}

type GoalSummaryProps = {
  displayName: string | null;
  topic: string;
  description: string | null;
  createdAt: string;
  timezone: string;
};

export function GoalSummary({
  displayName,
  topic,
  description,
  createdAt,
  timezone,
}: GoalSummaryProps): JSX.Element {
  return (
    <Card variant="purple">
      <SectionHeading eyebrow="Your learning goal">
        {displayName ?? 'You are learning'}
      </SectionHeading>
      <p className="mt-5 font-display text-3xl uppercase">{topic}</p>
      {description ? (
        <p className="mt-4 max-w-2xl font-medium leading-relaxed">{description}</p>
      ) : null}
      <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs font-bold uppercase">
        <span className="border-2 border-border bg-surface px-2 py-1">
          Started {formatTrackerCreatedDate(createdAt, timezone)}
        </span>
        <span className="border-2 border-border bg-yellow px-2 py-1">{timezone}</span>
      </div>
    </Card>
  );
}
