import { eq } from 'drizzle-orm';
import { db, type DatabaseExecutor } from '../database/client';
import { trackers, type NewTracker, type Tracker } from '../database/schema/trackers';

export async function insertTracker(
  input: NewTracker,
  database: DatabaseExecutor = db
): Promise<Tracker> {
  const [tracker] = await database.insert(trackers).values(input).returning();
  return tracker;
}

export async function findTrackerBySlug(slug: string): Promise<Tracker | undefined> {
  const [tracker] = await db.select().from(trackers).where(eq(trackers.slug, slug)).limit(1);
  return tracker;
}

export async function findTrackerById(id: string): Promise<Tracker | undefined> {
  const [tracker] = await db.select().from(trackers).where(eq(trackers.id, id)).limit(1);
  return tracker;
}

export async function checkSlugExists(slug: string): Promise<boolean> {
  const tracker = await findTrackerBySlug(slug);
  return tracker !== undefined;
}
