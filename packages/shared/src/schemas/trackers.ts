import { z } from 'zod';

function isValidIanaTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional();

const trackerFieldsSchema = z
  .object({
    displayName: optionalText(60),
    topic: z.string().trim().min(2).max(100),
    description: optionalText(300),
    timezone: z
      .string()
      .trim()
      .min(1)
      .refine(isValidIanaTimezone, 'Must be a valid IANA timezone.'),
  })
  .strict();

export const trackerCreationSchema = trackerFieldsSchema.transform((input) => ({
  displayName: input.displayName,
  topic: input.topic,
  description: input.description,
  timezone: input.timezone,
}));

export type TrackerCreationInput = z.input<typeof trackerCreationSchema>;
export type NormalizedTrackerCreationInput = z.output<typeof trackerCreationSchema>;
