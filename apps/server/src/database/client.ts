import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../config/env';
import * as schema from './schema';

const sql = postgres(env.DATABASE_URL, {
  max: 10,
  prepare: false,
  connect_timeout: 10,
  idle_timeout: 20,
});

export const db = drizzle(sql, { schema });

export type DatabaseExecutor = Pick<typeof db, 'insert' | 'select' | 'update' | 'delete'>;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await sql.end({ timeout: 5 });
}
