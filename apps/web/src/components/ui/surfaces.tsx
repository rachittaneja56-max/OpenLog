import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardVariant = 'default' | 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-surface',
  yellow: 'bg-yellow',
  pink: 'bg-pink',
  blue: 'bg-blue',
  green: 'bg-green',
  orange: 'bg-orange',
  purple: 'bg-purple',
};

export type CardProps = ComponentPropsWithoutRef<'div'> & { variant?: CardVariant };

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = 'default', ...props },
  ref
) {
  return <div ref={ref} className={cn('neo-card', cardVariants[variant], className)} {...props} />;
});

export type StatCardProps = CardProps & {
  label: string;
  value: ReactNode;
  detail?: string;
};

export function StatCard({ label, value, detail, children, ...props }: StatCardProps): JSX.Element {
  return (
    <Card {...props}>
      <p className="font-mono text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="mt-3 font-display text-5xl leading-none">{value}</p>
      {detail ? <p className="mt-3 font-mono text-xs font-bold uppercase">{detail}</p> : null}
      {children}
    </Card>
  );
}

type BadgeTone = 'default' | 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'danger';

const badgeTones: Record<Exclude<BadgeTone, 'default'>, string> = {
  yellow: 'bg-yellow',
  pink: 'bg-pink',
  blue: 'bg-blue',
  green: 'bg-green',
  orange: 'bg-orange',
  purple: 'bg-purple',
  danger: 'bg-danger',
};

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}): JSX.Element {
  const toneClass = tone === 'default' ? 'bg-surface' : badgeTones[tone];
  return <span className={cn('neo-badge', toneClass, className)}>{children}</span>;
}

export function Sticker({
  children,
  tone = 'yellow',
  className,
}: {
  children: ReactNode;
  tone?: Exclude<BadgeTone, 'default' | 'danger'>;
  className?: string;
}): JSX.Element {
  return <span className={cn('neo-sticker', badgeTones[tone], className)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  children,
  className,
  id,
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}): JSX.Element {
  return (
    <div className={cn('space-y-2', className)}>
      {eyebrow ? (
        <p className="font-mono text-xs font-bold uppercase tracking-widest">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="text-3xl md:text-4xl">
        {children}
      </h2>
    </div>
  );
}

export function PageContainer({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main';
}): JSX.Element {
  return <Tag className={cn('mx-auto w-full max-w-6xl px-5 md:px-10', className)}>{children}</Tag>;
}

export function Divider({ className }: { className?: string }): JSX.Element {
  return <hr className={cn('border-0 border-t-[3px] border-border', className)} />;
}
