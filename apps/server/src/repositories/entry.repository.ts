import { and, desc, eq } from 'drizzle-orm';
import { db } from '../database/client';
import { entries, type Entry, type NewEntry } from '../database/schema/entries';

export type EntryUpdate = Partial<
  Pick<NewEntry, 'learned' | 'confusedAbout' | 'nextStep' | 'minutesSpent' | 'resourceUrl'>
>;

export async function insertEntry(input: NewEntry): Promise<Entry> {
  const [entry] = await db.insert(entries).values(input).returning();
  return entry;
}

export async function findEntriesByTracker(trackerId: string): Promise<Entry[]> {
  return db
    .select()
    .from(entries)
    .where(eq(entries.trackerId, trackerId))
    .orderBy(desc(entries.entryDate));
}

export async function findEntryById(id: string): Promise<Entry | undefined> {
  const [entry] = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  return entry;
}

export async function findEntryByTrackerAndDate(
  trackerId: string,
  entryDate: string
): Promise<Entry | undefined> {
  const [entry] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.trackerId, trackerId), eq(entries.entryDate, entryDate)))
    .limit(1);
  return entry;
}

export async function updateEntry(id: string, input: EntryUpdate): Promise<Entry | undefined> {
  const [entry] = await db
    .update(entries)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(entries.id, id))
    .returning();
  return entry;
}

export async function deleteEntry(id: string): Promise<Entry | undefined> {
  const [entry] = await db.delete(entries).where(eq(entries.id, id)).returning();
  return entry;
}
