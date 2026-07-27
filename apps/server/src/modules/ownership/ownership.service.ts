import { createHash, timingSafeEqual } from 'node:crypto';
import {
  findOwnerAccessByTracker,
  updateOwnerAccessUsage,
} from '../../repositories/owner-access.repository';
import { findTrackerBySlug } from '../../repositories/tracker.repository';
import type { OwnerCookieSource, OwnershipResult, TrackerAccessResult } from './ownership.types';
import { getOwnerCookieName } from './owner-cookie';

function hashOwnerToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function hashesMatch(receivedHash: string, storedHash: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(storedHash) || !/^[a-f0-9]{64}$/i.test(receivedHash)) {
    return false;
  }

  const received = Buffer.from(receivedHash, 'hex');
  const stored = Buffer.from(storedHash, 'hex');
  return received.length === stored.length && timingSafeEqual(received, stored);
}

async function checkLegacyOwnership(
  tracker: { id: string },
  cookies: OwnerCookieSource
): Promise<boolean> {
  const cookieValue = cookies[getOwnerCookieName(tracker.id)];
  if (typeof cookieValue !== 'string' || cookieValue.length === 0) {
    return false;
  }

  const receivedHash = hashOwnerToken(cookieValue);
  const accessRecords = await findOwnerAccessByTracker(tracker.id);
  const matchingRecord = accessRecords.find((record) =>
    hashesMatch(receivedHash, record.tokenHash)
  );

  if (!matchingRecord) return false;

  await updateOwnerAccessUsage(matchingRecord.id, new Date());
  return true;
}

export async function checkOwnership(
  slug: string,
  cookies: OwnerCookieSource
): Promise<OwnershipResult> {
  const tracker = await findTrackerBySlug(slug);
  if (!tracker) return { isOwner: false };

  return {
    isOwner: await checkLegacyOwnership(tracker, cookies),
  };
}

export async function getTrackerAccess(
  slug: string,
  cookies: OwnerCookieSource,
  userId?: string
): Promise<TrackerAccessResult> {
  const tracker = await findTrackerBySlug(slug);
  if (!tracker) {
    return { isOwner: false, requiresLogin: true, canClaim: false };
  }

  if (userId && tracker.ownerUserId === userId) {
    return { isOwner: true, requiresLogin: false, canClaim: false };
  }

  const hasLegacyOwnership = await checkLegacyOwnership(tracker, cookies);
  if (tracker.ownerUserId === null && hasLegacyOwnership) {
    return { isOwner: false, requiresLogin: false, canClaim: true };
  }

  return {
    isOwner: false,
    requiresLogin: userId === undefined,
    canClaim: false,
  };
}
