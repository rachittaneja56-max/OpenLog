import { describe, expect, it } from 'vitest';
import { getSafeReturnPath } from './auth-navigation';

describe('getSafeReturnPath', () => {
  it('defaults to history when no destination is supplied', () => {
    expect(getSafeReturnPath('')).toBe('/history');
  });

  it('keeps an internal dashboard destination and its query', () => {
    expect(getSafeReturnPath('?returnTo=%2Fdashboard%2Fsystem-design-a1b2%3Fentry%3Dtoday')).toBe(
      '/dashboard/system-design-a1b2?entry=today'
    );
  });

  it('rejects protocol-relative and external destinations', () => {
    expect(getSafeReturnPath('?returnTo=%2F%2Fevil.example')).toBe('/history');
    expect(getSafeReturnPath('?returnTo=https%3A%2F%2Fevil.example')).toBe('/history');
  });

  it('prevents redirect loops back to login', () => {
    expect(getSafeReturnPath('?returnTo=%2Flogin')).toBe('/history');
    expect(getSafeReturnPath('?returnTo=%2Flogin%3Fmode%3Dregister')).toBe('/history');
  });
});
