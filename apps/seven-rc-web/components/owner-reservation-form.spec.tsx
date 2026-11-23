// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createOne = vi.hoisted(() => vi.fn());
const createSeries = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useCreateOwnerReservationMutation: () => ({ mutateAsync: createOne, isPending: false }),
  useCreateRecurringReservationMutation: () => ({ mutateAsync: createSeries, isPending: false }),
  useRecordReservationPaymentMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock('@/lib/player-queries', () => ({
  usePitchAvailabilityQuery: () => ({
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    data: {
      currency: 'COP',
      slots: [
        {
          startAt: '2026-10-10T01:00:00.000Z',
          endAt: '2026-10-10T02:00:00.000Z',
          status: 'AVAILABLE',
          priceMinor: 5_000_000,
        },
      ],
    },
  }),
}));

import { OwnerReservationSection } from './owner-reservation-form';
import type { OwnerVenue, PitchWithPricing } from '@/lib/owner-queries';

const venue = { id: 'v1', currency: 'COP', countryCode: 'CO' } as unknown as OwnerVenue;
const pitch = { id: 'p1', name: 'Cancha 1', sportType: 'football' } as unknown as PitchWithPricing;

function renderForm() {
  render(
    <OwnerReservationSection
      venue={venue}
      pitches={[pitch]}
      timeZone="America/Bogota"
      todayKey="2026-10-05"
    />,
  );
}

async function fillBase() {
  await userEvent.click(screen.getByRole('radio', { name: /^8:00/ }));
  await userEvent.type(screen.getByLabelText('Nombre del cliente'), 'Los Pibes');
}

beforeEach(() => {
  createOne.mockReset();
  createSeries.mockReset();
});

describe('OwnerReservationSection weekly repeat', () => {
  it('creates a series and lists the skipped weeks', async () => {
    createSeries.mockResolvedValue({
      seriesId: 's1',
      created: [{ id: 'r1' }, { id: 'r3' }],
      skipped: [
        {
          startAt: '2026-10-17T01:00:00.000Z',
          reason: 'BLOCKED',
        },
      ],
    });
    renderForm();
    await fillBase();
    await userEvent.click(screen.getByRole('checkbox', { name: /repetir cada semana/i }));
    await userEvent.clear(screen.getByLabelText(/semanas/i));
    await userEvent.type(screen.getByLabelText(/semanas/i), '3');
    await userEvent.click(screen.getByRole('button', { name: 'Crear reserva' }));

    expect(createSeries).toHaveBeenCalledWith({
      pitchId: 'p1',
      startAt: '2026-10-10T01:00:00.000Z',
      occurrences: 3,
      customerName: 'Los Pibes',
    });
    expect(createOne).not.toHaveBeenCalled();
    expect(await screen.findByText(/2 de 3 semanas reservadas/)).toBeTruthy();
    expect(screen.getByText(/cancha bloqueada/)).toBeTruthy();
  });

  it('does not submit out-of-range weeks (native min/max validation)', async () => {
    renderForm();
    await fillBase();
    await userEvent.click(screen.getByRole('checkbox', { name: /repetir cada semana/i }));
    await userEvent.clear(screen.getByLabelText(/semanas/i));
    await userEvent.type(screen.getByLabelText(/semanas/i), '1');
    await userEvent.click(screen.getByRole('button', { name: 'Crear reserva' }));

    expect(screen.queryByText(/semanas reservadas/)).toBeNull();
    expect(createSeries).not.toHaveBeenCalled();
  });

  it('keeps single bookings on the normal endpoint', async () => {
    createOne.mockResolvedValue({
      id: 'r1',
      startAt: '2026-10-10T01:00:00.000Z',
      endAt: '2026-10-10T02:00:00.000Z',
    });
    renderForm();
    await fillBase();
    await userEvent.click(screen.getByRole('button', { name: 'Crear reserva' }));

    expect(createOne).toHaveBeenCalledTimes(1);
    expect(createSeries).not.toHaveBeenCalled();
  });
});
