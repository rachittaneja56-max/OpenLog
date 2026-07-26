import { entryCreationSchema, entryUpdateSchema } from '@openlog/shared';
import { z } from 'zod';

export { entryCreationSchema, entryUpdateSchema };

export const entryIdParamSchema = z
  .object({
    entryId: z.string().uuid(),
  })
  .strict();

export function getFieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((fieldErrors, issue) => {
    const field = issue.path[0];
    if (typeof field !== 'string') return fieldErrors;
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    return fieldErrors;
  }, {});
}
