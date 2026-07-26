import { date, integer, pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { trackers } from './trackers';

export const entries = pgTable(
  'entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    trackerId: uuid('tracker_id')
      .notNull()
      .references(() => trackers.id, { onDelete: 'cascade' }),
    entryDate: date('entry_date').notNull(),
    learned: text('learned').notNull(),
    confusedAbout: text('confused_about'),
    nextStep: text('next_step'),
    minutesSpent: integer('minutes_spent'),
    resourceUrl: text('resource_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    trackerDateUnique: unique('entries_tracker_date_unique').on(table.trackerId, table.entryDate),
  })
);

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
