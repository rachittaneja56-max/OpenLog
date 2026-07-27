import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    usernameUnique: unique('users_username_unique').on(table.username),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
