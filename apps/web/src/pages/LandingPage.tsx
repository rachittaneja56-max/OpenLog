import { ArrowRight, Check, Flame, Globe2, Minus, Plus } from 'lucide-react';
import { TrackerCreationForm } from '../features/trackers/components';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CopyButton,
  Dialog,
  Divider,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingBlock,
  NumberInput,
  SectionHeading,
  Select,
  StatCard,
  Sticker,
  Textarea,
  TextInput,
  Toast,
} from '../components/ui';

export function LandingPage(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const demoLoading = (): void => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="space-y-10 md:space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="neo-box bg-purple p-7 md:p-12">
          <p className="mb-6 font-mono text-sm font-bold uppercase tracking-widest">
            The public learning log
          </p>
          <h1 className="max-w-4xl text-5xl leading-[0.95] md:text-7xl">
            Make learning impossible to hide.
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed md:text-xl">
            OpenLog is a simple place to show up, learn in public, and build a streak one day at a
            time.
          </p>
          <div className="mt-9 inline-flex cursor-not-allowed items-center gap-3 border-[3px] border-border bg-green px-5 py-4 font-bold uppercase shadow-neo opacity-80">
            <Plus aria-hidden="true" size={22} strokeWidth={3} />
            Start a tracker <span className="font-mono text-xs">(next phase)</span>
          </div>
        </div>

        <div className="neo-box flex flex-col justify-between bg-yellow p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="border-[3px] border-border bg-surface px-3 py-2 font-mono text-xs font-bold uppercase">
              Example log
            </span>
            <Flame aria-hidden="true" size={38} strokeWidth={3} />
          </div>
          <div className="mt-12">
            <p className="font-mono text-sm font-bold uppercase tracking-widest">Current streak</p>
            <p className="font-display text-8xl leading-none md:text-9xl">07</p>
            <p className="mt-3 font-mono font-bold uppercase">days of system design</p>
          </div>
          <div className="mt-10 grid grid-cols-7 gap-2" aria-label="Example activity heatmap">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <span
                key={day}
                className={`aspect-square border-2 border-border ${day < 5 ? 'bg-green' : 'bg-surface'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <TrackerCreationForm />

      <section className="grid gap-6 md:grid-cols-3">
        <div className="neo-box bg-blue p-6 md:p-8">
          <Flame aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Build a streak</h2>
          <p className="font-medium leading-relaxed">
            Turn tiny daily sessions into visible momentum.
          </p>
        </div>
        <div className="neo-box bg-pink p-6 md:p-8">
          <Globe2 aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Share the work</h2>
          <p className="font-medium leading-relaxed">
            One public link makes your learning journey easy to follow.
          </p>
        </div>
        <div className="neo-box bg-orange p-6 md:p-8">
          <Check aria-hidden="true" className="mb-6" size={32} strokeWidth={3} />
          <h2 className="mb-4 text-2xl">Keep it frictionless</h2>
          <p className="font-medium leading-relaxed">
            No account maze. Just a focused space for showing up.
          </p>
        </div>
      </section>

      <section className="neo-box bg-surface p-5 md:p-10" aria-labelledby="style-preview-heading">
        <SectionHeading id="style-preview-heading" eyebrow="Internal preview" className="mb-8">
          OpenLog design system
        </SectionHeading>
        <p className="mb-10 max-w-3xl text-lg font-medium">
          Temporary component inventory for checking contrast, focus, spacing, and interaction
          states before product screens arrive.
        </p>

        <div className="space-y-10">
          <div>
            <h3 className="mb-4 text-xl">Buttons and actions</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="small">
                Primary
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger" size="large">
                Danger
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button loading={loading} onClick={demoLoading}>
                {loading ? 'Saving' : 'Demo loading'}
              </Button>
              <Button disabled>Disabled</Button>
              <IconButton label="Decrease example value">
                <Minus aria-hidden="true" size={18} strokeWidth={3} />
              </IconButton>
              <CopyButton value="https://openlog.example/system-design" label="Copy example link" />
              <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
            </div>
          </div>

          <Divider />

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl">Form controls</h3>
              <div className="grid gap-5">
                <TextInput
                  id="preview-goal"
                  label="Learning goal"
                  placeholder="System Design"
                  helperText="Keep it clear and specific."
                />
                <Textarea
                  id="preview-entry"
                  label="Daily entry"
                  placeholder="What did you learn today?"
                  required
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <NumberInput id="preview-days" label="Active days" defaultValue={7} min={0} />
                  <Select
                    id="preview-tone"
                    label="Card tone"
                    defaultValue="yellow"
                    options={[
                      { label: 'Yellow', value: 'yellow' },
                      { label: 'Purple', value: 'purple' },
                    ]}
                  />
                </div>
                <TextInput
                  id="preview-error"
                  label="Validation example"
                  error="This field needs your attention."
                  defaultValue="Oops"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xl">Labels and stats</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="green">Active</Badge>
                <Badge tone="pink">Public</Badge>
                <Badge tone="blue">Draft</Badge>
                <Sticker tone="orange">7 day streak</Sticker>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatCard variant="yellow" label="Current streak" value="07" detail="days" />
                <StatCard variant="blue" label="Active days" value="24" detail="this month" />
              </div>
              <Card variant="purple" className="mt-4">
                <p className="font-mono text-xs font-bold uppercase tracking-widest">
                  Card primitive
                </p>
                <p className="mt-3 font-medium">
                  Flat color, thick border, and a hard offset shadow.
                </p>
              </Card>
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="mb-4 text-xl">States and feedback</h3>
            <div className="grid gap-5 lg:grid-cols-3">
              <LoadingBlock label="Loading entries" />
              <EmptyState
                title="No entries yet"
                description="Your first daily note will appear here."
                action={<Button size="small">Add first entry</Button>}
              />
              <ErrorState
                title="Could not load"
                description="The preview data could not be fetched."
                onRetry={() => setToastVisible(true)}
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button onClick={() => setToastVisible(true)}>Show toast</Button>
              <Toast
                message="Copied to clipboard."
                visible={toastVisible}
                onDismiss={() => setToastVisible(false)}
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} title="Preview dialog" onClose={() => setDialogOpen(false)}>
        <p className="font-medium">
          Dialogs keep the same loud borders and hard shadow while trapping attention with clear
          keyboard close behavior.
        </p>
        <Button className="mt-6" onClick={() => setDialogOpen(false)}>
          Close dialog
        </Button>
      </Dialog>

      <section className="flex flex-col items-start justify-between gap-6 border-y-[3px] border-border py-7 md:flex-row md:items-center">
        <p className="font-mono text-sm font-bold uppercase tracking-widest">
          A starter scaffold for a better learning habit.
        </p>
        <span className="inline-flex items-center gap-2 font-bold uppercase">
          Coming next <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
        </span>
      </section>
    </div>
  );
}
