import { z } from 'zod';

export const PlaceholderSchema = z.object({
  id: z.string().min(1),
});
