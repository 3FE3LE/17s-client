// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const configure = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useConfigurePitchSlotsMutation: () => ({ mutateAsync: configure, isPending: false }),
}));

import { OpeningHoursForm } from './opening-hours-form';
import type { PitchWithPricing } from '@/lib/owner-queries';

const pitch = {
  id: 'p1',
  name: 'Cancha 1',
  slotDurationMinutes: 60,
  openingHours: { '1': { openTime: '08:00', closeTime: '22:00' } },
} as unknown as PitchWithPricing;

beforeEach(() => {
  configure.mockReset();
  configure.mockResolvedValue({});
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('OpeningHoursForm', () => {
  it('asks for at least one day', async () => {
    render(<OpeningHoursForm venueId="v1" pitch={pitch} />);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar horarios' }));

    expect(await screen.findByText('Elige al menos un día.')).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });

  it('rejects a closing time before opening', async () => {
    render(<OpeningHoursForm venueId="v1" pitch={pitch} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Martes' }));
    const close = screen.getByLabelText('Cierra');
    await userEvent.clear(close);
    await userEvent.type(close, '07:00');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar horarios' }));

    expect(
      await screen.findByText('La hora de cierre debe ser posterior a la de apertura.'),
    ).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });

  it('saves new days and keeps the untouched ones', async () => {
    render(<OpeningHoursForm venueId="v1" pitch={pitch} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Martes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar horarios' }));

    expect(await screen.findByText(/Guardaste 08:00–22:00/)).toBeTruthy();
    expect(configure).toHaveBeenCalledWith({
      openingHours: [
        { dayOfWeek: 1, openTime: '08:00', closeTime: '22:00' },
        { dayOfWeek: 2, openTime: '08:00', closeTime: '22:00' },
      ],
    });
  });

  it('says so when closing a day that was already closed', async () => {
    render(<OpeningHoursForm venueId="v1" pitch={pitch} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Martes' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Cerrado' }));
    await userEvent.click(screen.getByRole('button', { name: 'Marcar como cerrado' }));

    expect(await screen.findByText(/ya estaba cerrado/)).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });
});
