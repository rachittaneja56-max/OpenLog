import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

const databaseUrl = z
  .string()
  .url()
  .parse(process.env.DATABASE_URL ?? 'postgresql://user:password@host/database?sslmode=require');

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
