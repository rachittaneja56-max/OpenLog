import { describe, expect, it, vi } from 'vitest';

vi.mock('../../config/env', () => ({
  env: { NODE_ENV: 'test' },
}));

import { getOwnerCookieName, getOwnerTrackerIds } from './owner-cookie';

const firstTrackerId = '5cb8fc0c-0bf8-4d81-8a78-b7fa5d9bf098';
const secondTrackerId = 'bc9e1203-300f-42ac-8c9d-003ad5428ef9';

describe('owner cookie discovery', () => {
  it('returns tracker ids represented by valid owner-cookie names', () => {
    expect(
      getOwnerTrackerIds({
        [getOwnerCookieName(firstTrackerId)]: 'first-token',
        [getOwnerCookieName(secondTrackerId)]: 'second-token',
        openlog_session: 'session-token',
      })
    ).toEqual([firstTrackerId, secondTrackerId]);
  });

  it('ignores malformed or unrelated cookie names', () => {
    expect(
      getOwnerTrackerIds({
        'openlog_owner_not-a-uuid': 'token',
        another_cookie: 'value',
      })
    ).toEqual([]);
  });
});
