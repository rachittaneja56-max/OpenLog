import { authCredentialsSchema, passwordSchema, usernameSchema } from '@openlog/shared';
import { z } from 'zod';
import { trackerSlugParamSchema } from '../../utils/validation';

export { authCredentialsSchema };

export const claimTrackerSchema = z
  .object({
    slug: trackerSlugParamSchema.shape.slug,
    username: usernameSchema.optional(),
    password: passwordSchema.optional(),
  })
  .strict();

export type AuthCredentialsInput = z.input<typeof authCredentialsSchema>;
export type ClaimTrackerInput = z.output<typeof claimTrackerSchema>;
