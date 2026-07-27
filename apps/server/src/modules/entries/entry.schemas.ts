import { entryCreationSchema, entryUpdateSchema } from '@openlog/shared';
import { z } from 'zod';

export { entryCreationSchema, entryUpdateSchema };

export const entryIdParamSchema = z
  .object({
    entryId: z.string().uuid(),
  })
  .strict();
