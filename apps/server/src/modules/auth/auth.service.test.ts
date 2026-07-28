import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../database/client', () => ({
  db: { transaction: vi.fn() },
}));
vi.mock('../../repositories/session.repository', () => ({
  deleteSession: vi.fn(),
  findSessionByTokenHash: vi.fn(),
  insertSession: vi.fn(),
  updateSessionUsage: vi.fn(),
}));
vi.mock('../../repositories/tracker.repository', () => ({
  findTrackerById: vi.fn(),
  findTrackerBySlug: vi.fn(),
  linkTrackerToUser: vi.fn(),
}));
vi.mock('../../repositories/user.repository', () => ({
  findUserById: vi.fn(),
  findUserByUsername: vi.fn(),
  insertUser: vi.fn(),
}));
vi.mock('../ownership/ownership.service', () => ({
  checkOwnership: vi.fn(),
}));
vi.mock('../ownership/owner-cookie', () => ({
  getOwnerTrackerIds: vi.fn(),
}));
vi.mock('./session-cookie', () => ({
  getSessionCookieValue: vi.fn(),
  getSessionExpiry: vi.fn(),
}));
vi.mock('./password', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

import { findTrackerById, linkTrackerToUser } from '../../repositories/tracker.repository';
import { checkOwnership } from '../ownership/ownership.service';
import { getOwnerTrackerIds } from '../ownership/owner-cookie';
import { claimLegacyTrackersForUser } from './auth.service';

const trackerId = '5cb8fc0c-0bf8-4d81-8a78-b7fa5d9bf098';
const userId = 'bc9e1203-300f-42ac-8c9d-003ad5428ef9';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('claimLegacyTrackersForUser', () => {
  it('attaches every unclaimed tracker proven by an owner cookie', async () => {
    vi.mocked(getOwnerTrackerIds).mockReturnValue([trackerId]);
    vi.mocked(findTrackerById).mockResolvedValue({
      id: trackerId,
      slug: 'system-design-a1b2',
      ownerUserId: null,
    } as never);
    vi.mocked(checkOwnership).mockResolvedValue({ isOwner: true });
    vi.mocked(linkTrackerToUser).mockResolvedValue({ id: trackerId } as never);

    const claimed = await claimLegacyTrackersForUser(
      { [`openlog_owner_${trackerId}`]: 'private-owner-token' },
      userId
    );

    expect(claimed).toBe(1);
    expect(linkTrackerToUser).toHaveBeenCalledWith(trackerId, userId);
  });

  it('does not attach a tracker when the cookie cannot prove ownership', async () => {
    vi.mocked(getOwnerTrackerIds).mockReturnValue([trackerId]);
    vi.mocked(findTrackerById).mockResolvedValue({
      id: trackerId,
      slug: 'system-design-a1b2',
      ownerUserId: null,
    } as never);
    vi.mocked(checkOwnership).mockResolvedValue({ isOwner: false });

    const claimed = await claimLegacyTrackersForUser(
      { [`openlog_owner_${trackerId}`]: 'wrong-owner-token' },
      userId
    );

    expect(claimed).toBe(0);
    expect(linkTrackerToUser).not.toHaveBeenCalled();
  });

  it('leaves trackers that already belong to an account unchanged', async () => {
    vi.mocked(getOwnerTrackerIds).mockReturnValue([trackerId]);
    vi.mocked(findTrackerById).mockResolvedValue({
      id: trackerId,
      slug: 'system-design-a1b2',
      ownerUserId: '0aa49ef8-02e9-41d3-a40e-95ea00fca4f0',
    } as never);

    const claimed = await claimLegacyTrackersForUser({}, userId);

    expect(claimed).toBe(0);
    expect(checkOwnership).not.toHaveBeenCalled();
    expect(linkTrackerToUser).not.toHaveBeenCalled();
  });
});
