import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@17suit/core', () => ({
  loadEnv: () => ({ API_BASE_URL: 'http://api.test/' }),
}));

import { fetchPlatformMe } from './platform-api';

describe('fetchPlatformMe', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('asks the profile endpoint once, with no probing of other paths', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ role: 'OWNER' }), { status: 200 }));

    await expect(fetchPlatformMe('tok')).resolves.toEqual({ role: 'OWNER' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://api.test/api/me');
  });

  it('does not retry on 404', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 404 }));

    await expect(fetchPlatformMe('tok')).rejects.toThrow('Failed to fetch profile (404)');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
