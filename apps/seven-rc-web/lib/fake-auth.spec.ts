import { afterEach, describe, expect, it, vi } from 'vitest';
import { fakeUserId, isFakeAuthEnabled, parseFakeSession } from './fake-auth';

describe('fake auth seam', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('is off unless E2E_FAKE_AUTH=1', () => {
    expect(isFakeAuthEnabled()).toBe(false);
    vi.stubEnv('E2E_FAKE_AUTH', '1');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isFakeAuthEnabled()).toBe(true);
  });

  it('is never on in a production build or Vercel production', () => {
    vi.stubEnv('E2E_FAKE_AUTH', '1');
    vi.stubEnv('NODE_ENV', 'production');
    expect(isFakeAuthEnabled()).toBe(false);
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(isFakeAuthEnabled()).toBe(false);
  });

  it('only accepts test:<id> cookies', () => {
    expect(parseFakeSession('test:owner_1')).toBe('test:owner_1');
    expect(parseFakeSession('test%3Aowner_1')).toBe('test:owner_1');
    expect(parseFakeSession('test:')).toBeNull();
    expect(parseFakeSession('owner_1')).toBeNull();
    expect(parseFakeSession(undefined)).toBeNull();
    expect(fakeUserId('test:owner_1')).toBe('owner_1');
  });
});
