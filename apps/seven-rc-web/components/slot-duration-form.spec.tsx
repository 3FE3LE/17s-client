// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const configure = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useConfigurePitchSlotsMutation: () => ({ mutateAsync: configure, isPending: false }),
}));

import { SlotDurationForm } from './slot-duration-form';
import type { PitchWithPricing } from '@/lib/owner-queries';

const pitch = {
  id: 'p1',
  name: 'Cancha 1',
  slotDurationMinutes: 60,
  openingHours: { '1': { openTime: '08:00', closeTime: '22:00' } },
} as unknown as PitchWithPricing;

async function setDuration(value: string) {
  const input = screen.getByLabelText('Minutos por turno');
  await userEvent.clear(input);
  await userEvent.type(input, value);
  await userEvent.click(screen.getByRole('button', { name: 'Guardar duración' }));
}

beforeEach(() => {
  configure.mockReset();
  configure.mockResolvedValue({});
});

describe('SlotDurationForm', () => {
  it('saves a new duration with the current week', async () => {
    render(<SlotDurationForm venueId="v1" pitch={pitch} />);
    await setDuration('90');

    expect(await screen.findByText(/ahora duran/)).toBeTruthy();
    expect(configure).toHaveBeenCalledWith({
      openingHours: [{ dayOfWeek: 1, openTime: '08:00', closeTime: '22:00' }],
      slotDurationMinutes: 90,
    });
  });

  it('does not call the server when nothing changed', async () => {
    render(<SlotDurationForm venueId="v1" pitch={pitch} />);
    await setDuration('60');

    expect(await screen.findByText('La duración ya era esa. No hubo cambios.')).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });

  it('rejects durations out of range inline', async () => {
    render(<SlotDurationForm venueId="v1" pitch={pitch} />);
    await setDuration('10');

    expect(
      await screen.findByText('La duración del turno debe estar entre 30 y 240 minutos.'),
    ).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });
});
