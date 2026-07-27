import { z } from 'zod';

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters.')
  .max(30, 'Username must be 30 characters or fewer.')
  .regex(/^[a-zA-Z0-9_]+$/, 'Use letters, numbers, and underscores only.')
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters.')
  .max(128, 'Password must be 128 characters or fewer.');

export const authCredentialsSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
  })
  .strict();

export type AuthCredentialsInput = z.input<typeof authCredentialsSchema>;
export type NormalizedAuthCredentials = z.output<typeof authCredentialsSchema>;
