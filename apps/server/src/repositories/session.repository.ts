import { eq } from 'drizzle-orm';
import { db, type DatabaseExecutor } from '../database/client';
import { sessions, type NewSession, type Session } from '../database/schema/sessions';

export async function insertSession(
  input: NewSession,
  database: DatabaseExecutor = db
): Promise<Session> {
  const [session] = await database.insert(sessions).values(input).returning();
  return session;
}

export async function findSessionByTokenHash(tokenHash: string): Promise<Session | undefined> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);
  return session;
}

export async function updateSessionUsage(
  id: string,
  lastUsedAt: Date
): Promise<Session | undefined> {
  const [session] = await db
    .update(sessions)
    .set({ lastUsedAt })
    .where(eq(sessions.id, id))
    .returning();
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}
