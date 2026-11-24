import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSevenRcOwnerApi } from './seven-rc-api';

const fetchMock = vi.fn();

function api() {
  vi.stubGlobal('fetch', fetchMock);
  return createSevenRcOwnerApi({
    apiBaseUrls: ['https://api.test'],
    getAccessToken: () => Promise.resolve('token'),
  });
}

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('ownerCancelReservation', () => {
  it('sends the refund decision as the JSON body', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 201 }));
    await api().ownerCancelReservation('r1', { refundDecision: 'refund', method: 'cash' });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.test/7rc/reservations/r1/owner-cancel');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ refundDecision: 'refund', method: 'cash' });
  });

  it('sends no body when nothing was paid', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 201 }));
    await api().ownerCancelReservation('r1');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBeUndefined();
  });
});
