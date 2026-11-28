import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@17suit/core', () => ({ loadEnv: () => ({ API_BASE_URL: 'http://api.test' }) }));

import { fetchPublicVenue, fetchPublicVenueAvailability } from './public-venue-api';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('fetchPublicVenue', () => {
  it('is never cached so today and policyVersion are fresh', async () => {
    fetchMock.mockResolvedValue(new Response('{"today":"2026-11-23"}', { status: 200 }));
    await fetchPublicVenue('club');
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ cache: 'no-store' });
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty('next');
  });
});

describe('fetchPublicVenueAvailability', () => {
  it('returns an empty day on 400 instead of throwing', async () => {
    fetchMock.mockResolvedValue(
      new Response('{"errorKey":"outsideBookingWindow"}', { status: 400 }),
    );
    const result = await fetchPublicVenueAvailability('club', '2026-12-30');
    expect(result).toMatchObject({ date: '2026-12-30', pitches: [] });
  });

  it('returns null on 404 and throws on 5xx', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 404 }));
    expect(await fetchPublicVenueAvailability('club', '2026-11-23')).toBeNull();
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 500 }));
    await expect(fetchPublicVenueAvailability('club', '2026-11-23')).rejects.toThrow();
  });
});
