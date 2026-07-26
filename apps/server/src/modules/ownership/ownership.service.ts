import { createHash, timingSafeEqual } from 'node:crypto';
import {
  findOwnerAccessByTracker,
  updateOwnerAccessUsage,
} from '../../repositories/owner-access.repository';
import { findTrackerBySlug } from '../../repositories/tracker.repository';
import type { OwnerCookieSource, OwnershipResult } from './ownership.types';
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

export async function checkOwnership(
  slug: string,
  cookies: OwnerCookieSource
): Promise<OwnershipResult> {
  const tracker = await findTrackerBySlug(slug);
  if (!tracker) return { isOwner: false };

  const cookieValue = cookies[getOwnerCookieName(tracker.id)];
  if (typeof cookieValue !== 'string' || cookieValue.length === 0) {
    return { isOwner: false };
  }

  const receivedHash = hashOwnerToken(cookieValue);
  const accessRecords = await findOwnerAccessByTracker(tracker.id);
  const matchingRecord = accessRecords.find((record) =>
    hashesMatch(receivedHash, record.tokenHash)
  );

  if (!matchingRecord) return { isOwner: false };

  await updateOwnerAccessUsage(matchingRecord.id, new Date());
  return { isOwner: true };
}
