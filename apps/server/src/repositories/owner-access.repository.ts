import { eq } from 'drizzle-orm';
import { db } from '../database/client';
import {
  ownerAccess,
  type NewOwnerAccess,
  type OwnerAccess,
} from '../database/schema/owner-access';

export async function insertOwnerAccess(input: NewOwnerAccess): Promise<OwnerAccess> {
  const [access] = await db.insert(ownerAccess).values(input).returning();
  return access;
}

export async function findOwnerAccessByTracker(trackerId: string): Promise<OwnerAccess[]> {
  return db.select().from(ownerAccess).where(eq(ownerAccess.trackerId, trackerId));
}

export async function updateOwnerAccessUsage(
  id: string,
  lastUsedAt: Date
): Promise<OwnerAccess | undefined> {
  const [access] = await db
    .update(ownerAccess)
    .set({ lastUsedAt })
    .where(eq(ownerAccess.id, id))
    .returning();
  return access;
}
