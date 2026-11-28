import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('@/lib/public-venue-api', () => ({
  fetchPublicVenue: vi.fn(),
  fetchPublicVenueAvailability: vi.fn(),
}));
vi.mock('@/lib/i18n-server', async () => {
  const { createI18n } = await import('@17suit/i18n');
  const { sevenRcResources } = await import('@17suit/module-seven-reservations-club/i18n');
  const i18n = createI18n({ locale: 'es', resources: sevenRcResources });
  return {
    getServerT: (ns: 'play') => Promise.resolve({ t: i18n.getFixedT('es', ns), locale: 'es' }),
  };
});
vi.mock('@/components/guest-booking-form', () => ({ GuestBookingForm: () => null }));

import { fetchPublicVenue, fetchPublicVenueAvailability } from '@/lib/public-venue-api';
import PublicVenuePage from './page';

const venue = {
  slug: 'cancha-la-70',
  name: 'Cancha La 70',
  address: 'Cra 70 #45-10',
  contactPhone: '+573001234567',
  timezone: 'America/Bogota',
  currency: 'COP',
  today: '2026-11-23',
  bookingHorizonDays: 30,
  depositPercent: 30,
  holdMinutes: 30,
  policyVersion: 2,
  pitches: [
    {
      id: 'p1',
      name: 'Cancha 1',
      sportType: 'FUTBOL_5',
      slotDurationMinutes: 60,
      basePriceMinor: 8000000,
    },
  ],
};

const availability = {
  currency: 'COP',
  pitches: [
    {
      pitchId: 'p1',
      pitchName: 'Cancha 1',
      sportType: 'FUTBOL_5',
      slots: [
        {
          startAt: '2026-11-23T23:00:00.000Z',
          endAt: '2026-11-24T00:00:00.000Z',
          status: 'AVAILABLE',
          priceMinor: 8000000,
        },
      ],
    },
  ],
};

describe('public venue page /c/[slug]', () => {
  beforeEach(() => {
    vi.mocked(fetchPublicVenue).mockResolvedValue(venue as never);
    vi.mocked(fetchPublicVenueAvailability).mockResolvedValue(availability as never);
  });

  it('renders on the server without client-only hooks and lists the free slot', async () => {
    const tree = await PublicVenuePage({
      params: Promise.resolve({ slug: 'cancha-la-70' }),
      searchParams: Promise.resolve({}),
    });

    const html = renderToStaticMarkup(tree);

    expect(html).toContain('Cancha La 70');
    expect(html).toContain('Reservar');
  });

  it('falls back to today for an invalid date instead of failing', async () => {
    await PublicVenuePage({
      params: Promise.resolve({ slug: 'cancha-la-70' }),
      searchParams: Promise.resolve({ fecha: 'basura' }),
    });

    expect(fetchPublicVenueAvailability).toHaveBeenCalledWith('cancha-la-70', '2026-11-23');
  });

  it('clamps a date past the booking horizon to today', async () => {
    await PublicVenuePage({
      params: Promise.resolve({ slug: 'cancha-la-70' }),
      searchParams: Promise.resolve({ fecha: '2027-12-31' }),
    });

    expect(fetchPublicVenueAvailability).toHaveBeenCalledWith('cancha-la-70', '2026-11-23');
  });

  it('clamps a past date to today', async () => {
    await PublicVenuePage({
      params: Promise.resolve({ slug: 'cancha-la-70' }),
      searchParams: Promise.resolve({ fecha: '2026-11-01' }),
    });

    expect(fetchPublicVenueAvailability).toHaveBeenCalledWith('cancha-la-70', '2026-11-23');
  });

  it('answers not found for an unknown venue', async () => {
    vi.mocked(fetchPublicVenue).mockResolvedValue(null);

    await expect(
      PublicVenuePage({
        params: Promise.resolve({ slug: 'no-existe' }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
