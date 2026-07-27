import { eq } from 'drizzle-orm';
import { db, type DatabaseExecutor } from '../database/client';
import { users, type NewUser, type User } from '../database/schema/users';

export async function insertUser(input: NewUser, database: DatabaseExecutor = db): Promise<User> {
  const [user] = await database.insert(users).values(input).returning();
  return user;
}

export async function findUserByUsername(
  username: string,
  database: DatabaseExecutor = db
): Promise<User | undefined> {
  const [user] = await database.select().from(users).where(eq(users.username, username)).limit(1);
  return user;
}

export async function findUserById(userId: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}
