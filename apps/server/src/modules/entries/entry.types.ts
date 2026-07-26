import type { EntryCreationInput, EntryUpdateInput } from '@openlog/shared';

export type PublicEntry = {
  id: string;
  entryDate: string;
  learned: string;
  confusedAbout: string | null;
  nextStep: string | null;
  minutesSpent: number | null;
  resourceUrl: string | null;
};

export type EntryRouteLocals = {
  slug?: string;
  entryId?: string;
  entryInput?: EntryCreationInput;
  entryUpdateInput?: EntryUpdateInput;
};
