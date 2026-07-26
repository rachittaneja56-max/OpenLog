import { pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';

export const trackers = pgTable(
  'trackers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull(),
    displayName: text('display_name'),
    topic: text('topic').notNull(),
    description: text('description'),
    timezone: text('timezone').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUnique: unique('trackers_slug_unique').on(table.slug),
  })
);

export type Tracker = typeof trackers.$inferSelect;
export type NewTracker = typeof trackers.$inferInsert;
