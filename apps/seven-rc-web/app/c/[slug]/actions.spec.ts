import { beforeEach, describe, expect, it, vi } from 'vitest';

class RedirectSignal extends Error {
  constructor(readonly url: string) {
    super(`NEXT_REDIRECT ${url}`);
  }
}

const api = vi.hoisted(() => ({
  fetchPublicVenue: vi.fn(),
  createPublicReservation: vi.fn(),
  cancelPublicReservation: vi.fn(),
}));

vi.mock('@/lib/public-venue-api', () => api);
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new RedirectSignal(url);
  },
}));

vi.mock('@17suit/i18n/next', () => ({ getProductLocale: () => Promise.resolve('es') }));

import { revalidatePath } from 'next/cache';

import { cancelReservationAction, reserveAction } from './actions';

const PITCH_ID = '123e4567-e89b-42d3-a456-426614174000';
const TOKEN = '987e6543-e21b-42d3-a456-426614174999';
const EMPTY = { fieldErrors: {}, formError: null };

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const fields = {
    customerName: 'Ana Pérez',
    customerPhone: '300 123 4567',
    notes: '',
    pitchId: PITCH_ID,
    startAt: '2026-11-23T00:00:00.000Z',
    fecha: '2026-11-22',
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

async function redirectOf(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof RedirectSignal) return error.url;
    throw error;
  }
  throw new Error('expected a redirect');
}

beforeEach(() => {
  vi.resetAllMocks();
  api.fetchPublicVenue.mockResolvedValue({ countryCode: 'CO' });
});

describe('reserveAction', () => {
  it('redirects to the venue page when the venue does not exist', async () => {
    api.fetchPublicVenue.mockResolvedValue(null);
    expect(await redirectOf(reserveAction('club', EMPTY, form()))).toBe('/c/club');
    expect(api.createPublicReservation).not.toHaveBeenCalled();
  });

  it('flags short names and invalid phones without calling the API', async () => {
    const state = await reserveAction(
      'club',
      EMPTY,
      form({ customerName: 'A', customerPhone: '123' }),
    );
    expect(state.fieldErrors.name).toBeDefined();
    expect(state.fieldErrors.phone).toBeDefined();
    expect(state.formError).toBe('Revisa los campos marcados.');
    expect(api.createPublicReservation).not.toHaveBeenCalled();
  });

  it('rejects an invalid pitch id or start time', async () => {
    const badPitch = await reserveAction('club', EMPTY, form({ pitchId: 'nope' }));
    expect(badPitch.formError).toMatch(/horario no es válido/);
    const badStart = await reserveAction('club', EMPTY, form({ startAt: 'later' }));
    expect(badStart.formError).toMatch(/horario no es válido/);
    expect(api.createPublicReservation).not.toHaveBeenCalled();
  });

  it('sends a normalized E.164 phone and omits empty notes', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: true, reservation: { token: TOKEN } });
    const url = await redirectOf(reserveAction('club', EMPTY, form()));
    expect(url).toBe(`/c/club/reserva/${TOKEN}`);
    expect(api.createPublicReservation).toHaveBeenCalledWith('club', {
      pitchId: PITCH_ID,
      startAt: '2026-11-23T00:00:00.000Z',
      customerName: 'Ana Pérez',
      customerPhone: '+573001234567',
    });
  });

  it('includes trimmed notes when present', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: true, reservation: { token: TOKEN } });
    await redirectOf(reserveAction('club', EMPTY, form({ notes: '  traer balón  ' })));
    expect(api.createPublicReservation).toHaveBeenCalledWith(
      'club',
      expect.objectContaining({ notes: 'traer balón' }),
    );
  });

  it('redirects back with conflicto=1 on 409, keeping the date', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 409 });
    expect(await redirectOf(reserveAction('club', EMPTY, form()))).toBe(
      '/c/club?fecha=2026-11-22&conflicto=1',
    );
  });

  it.each([
    'slotNotAligned',
    'slotAlreadyStarted',
    'outsideBookingWindow',
    'slotBlocked',
    'slotUnavailable',
  ])('redirects with conflicto=%s and refreshes availability', async (errorKey) => {
    api.createPublicReservation.mockResolvedValue({
      ok: false,
      status: errorKey === 'slotUnavailable' ? 409 : 400,
      message: '',
      code: 'HTTP_ERROR',
      errorKey,
      params: {},
    });
    expect(await redirectOf(reserveAction('club', EMPTY, form()))).toBe(
      `/c/club?fecha=2026-11-22&conflicto=${errorKey}`,
    );
    expect(revalidatePath).toHaveBeenCalledWith('/c/club');
  });

  it('shows the catalog message for tooManySlots on 400', async () => {
    api.createPublicReservation.mockResolvedValue({
      ok: false,
      status: 400,
      message: '',
      code: 'HTTP_ERROR',
      errorKey: 'tooManySlots',
      params: { max: 8 },
    });
    const state = await reserveAction('club', EMPTY, form());
    expect(state.formError).toBe('Una reserva puede incluir hasta 8 turnos seguidos.');
  });

  it('sends the policy version the visitor saw', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: true, reservation: { token: TOKEN } });
    await redirectOf(reserveAction('club', EMPTY, form({ policyVersion: '3' })));
    expect(api.createPublicReservation).toHaveBeenCalledWith(
      'club',
      expect.objectContaining({ policyVersion: 3 }),
    );
  });

  it('redirects with condiciones=1 and drops the cached venue on POLICY_CHANGED', async () => {
    api.createPublicReservation.mockResolvedValue({
      ok: false,
      status: 409,
      message: '',
      code: 'POLICY_CHANGED',
    });
    expect(await redirectOf(reserveAction('club', EMPTY, form({ policyVersion: '1' })))).toBe(
      '/c/club?fecha=2026-11-22&condiciones=1',
    );
    expect(revalidatePath).toHaveBeenCalledWith('/c/club');
  });

  it('adds conflicto=1 with ? when there is no valid date', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 409 });
    expect(await redirectOf(reserveAction('club', EMPTY, form({ fecha: 'x' })))).toBe(
      '/c/club?conflicto=1',
    );
  });

  it('returns a rate-limit message on 429', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 429 });
    const state = await reserveAction('club', EMPTY, form());
    expect(state.formError).toMatch(/Demasiados intentos/);
  });

  it('redirects to the venue page on 404', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 404 });
    expect(await redirectOf(reserveAction('club', EMPTY, form()))).toBe('/c/club');
  });

  it('returns a validation message on 400', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 400 });
    const state = await reserveAction('club', EMPTY, form());
    expect(state.formError).toMatch(/Revisa los datos/);
  });

  it('returns a server message on 5xx', async () => {
    api.createPublicReservation.mockResolvedValue({ ok: false, status: 502 });
    const state = await reserveAction('club', EMPTY, form());
    expect(state.formError).toMatch(/servidor tuvo un problema/);
  });

  it('returns a connectivity message when the request throws', async () => {
    api.createPublicReservation.mockRejectedValue(new Error('network'));
    const state = await reserveAction('club', EMPTY, form());
    expect(state.formError).toMatch(/No pudimos conectar/);
  });

  it('url-encodes the slug in redirects', async () => {
    api.fetchPublicVenue.mockResolvedValue(null);
    expect(await redirectOf(reserveAction('a b/c', EMPTY, form()))).toBe('/c/a%20b%2Fc');
  });
});

describe('cancelReservationAction', () => {
  it('rejects a malformed token without calling the API', async () => {
    expect(await cancelReservationAction('club', 'bad')).toEqual({
      error: 'Este enlace no es válido.',
    });
    expect(api.cancelPublicReservation).not.toHaveBeenCalled();
  });

  it('returns no error on success', async () => {
    api.cancelPublicReservation.mockResolvedValue({ ok: true });
    expect(await cancelReservationAction('club', TOKEN)).toEqual({ error: null });
  });

  it.each([
    [400, /Ya no se puede cancelar/],
    [404, /No encontramos/],
    [429, /Demasiados intentos/],
    [500, /servidor tuvo un problema/],
  ])('maps %i', async (status, expected) => {
    api.cancelPublicReservation.mockResolvedValue({ ok: false, status });
    expect((await cancelReservationAction('club', TOKEN)).error).toMatch(expected);
  });

  it('maps a thrown request to a connectivity message', async () => {
    api.cancelPublicReservation.mockRejectedValue(new Error('network'));
    expect((await cancelReservationAction('club', TOKEN)).error).toMatch(/No pudimos conectar/);
  });
});
