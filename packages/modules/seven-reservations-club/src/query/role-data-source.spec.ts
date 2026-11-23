import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createExternalPlatformRoleDataSource,
  createWebBffRoleDataSource,
} from './role-data-source';

function mockFetch() {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(new Response(JSON.stringify({ role: 'OWNER' }), { status: 200 })),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('createWebBffRoleDataSource', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the session token when reading and changing the role', async () => {
    const fetchMock = mockFetch();
    const source = createWebBffRoleDataSource({
      getAccessToken: () => Promise.resolve('session-jwt'),
    });

    await source.getCurrentUserRole();
    await source.setCurrentUserRole('OWNER');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls) {
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer session-jwt');
    }
  });

  it('omits the header without a token, so cookies still apply', async () => {
    const fetchMock = mockFetch();

    await createWebBffRoleDataSource({
      getAccessToken: () => Promise.resolve(null),
    }).getCurrentUserRole();

    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('authorization')).toBeNull();
  });
});

describe('createExternalPlatformRoleDataSource', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the profile from /api/me in a single request', async () => {
    const fetchMock = mockFetch();

    const result = await createExternalPlatformRoleDataSource({
      apiBaseUrl: 'http://api.test',
      getAccessToken: () => Promise.resolve('tok'),
    }).getCurrentUserRole();

    expect(result.role).toBe('OWNER');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('http://api.test/api/me');
  });
});
