import { z } from 'zod';

export const trackerSlugParamSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
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
