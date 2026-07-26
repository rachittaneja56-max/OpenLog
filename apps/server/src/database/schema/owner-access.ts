import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { trackers } from './trackers';

export const ownerAccess = pgTable('owner_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackerId: uuid('tracker_id')
    .notNull()
    .references(() => trackers.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
});

export type OwnerAccess = typeof ownerAccess.$inferSelect;
export type NewOwnerAccess = typeof ownerAccess.$inferInsert;
