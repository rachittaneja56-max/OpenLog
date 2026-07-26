import { z } from 'zod';

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim().length === 0 ? undefined : value),
    z.string().trim().max(maximum).optional()
  );

const nullableText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim().length === 0 ? null : value),
    z.union([z.string().trim().max(maximum), z.null()]).optional()
  );

function isHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const httpUrl = z.string().trim().url().refine(isHttpUrl, 'Must be an HTTP or HTTPS URL.');
const optionalHttpUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim().length === 0 ? undefined : value),
  httpUrl.optional()
);
const nullableHttpUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim().length === 0 ? null : value),
  z.union([httpUrl, z.null()]).optional()
);
const minutes = z.number().int().min(1).max(1440);

export const entryCreationSchema = z
  .object({
    learned: z.string().trim().min(3).max(1000),
    confusedAbout: optionalText(500),
    nextStep: optionalText(500),
    minutesSpent: minutes.optional(),
    resourceUrl: optionalHttpUrl,
  })
  .strict();

export const entryUpdateSchema = z
  .object({
    learned: z.string().trim().min(3).max(1000).optional(),
    confusedAbout: nullableText(500),
    nextStep: nullableText(500),
    minutesSpent: z.union([minutes, z.null()]).optional(),
    resourceUrl: nullableHttpUrl,
  })
  .strict();

export type EntryCreationInput = z.infer<typeof entryCreationSchema>;
export type EntryUpdateInput = z.infer<typeof entryUpdateSchema>;
