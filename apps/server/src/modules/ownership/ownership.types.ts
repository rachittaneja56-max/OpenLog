export type OwnershipResult = {
  isOwner: boolean;
};

export type TrackerAccessResult = {
  isOwner: boolean;
  requiresLogin: boolean;
  canClaim: boolean;
};

export type OwnerCookieSource = Readonly<Record<string, unknown>>;
