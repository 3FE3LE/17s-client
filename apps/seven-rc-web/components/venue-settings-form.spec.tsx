// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const update = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useUpdateVenueSettingsMutation: () => ({ mutateAsync: update, isPending: false }),
}));

import { VenueSettingsForm } from './venue-settings-form';
import type { OwnerVenue } from '@/lib/owner-queries';

const venue = {
  id: 'v1',
  name: 'Complejo',
  countryCode: 'CO',
  contactPhone: '+573001234567',
  paymentInstructions: '',
  depositPercent: 30,
  depositFromMinutes: 0,
  holdMinutes: 60,
  cancellationWindowHours: 24,
  lateCancelDeposit: 'retain',
  noShowDeposit: 'retain',
  conditionsText: '',
  bookingHorizonDays: 30,
} as unknown as OwnerVenue;

async function replace(label: string, value: string) {
  const input = screen.getByLabelText(label);
  await userEvent.clear(input);
  if (value) await userEvent.type(input, value);
}

beforeEach(() => {
  update.mockReset();
  update.mockResolvedValue({ reservationsKeepingPolicy: 0 });
});

describe('VenueSettingsForm', () => {
  it('saves numeric fields as numbers', async () => {
    render(<VenueSettingsForm venue={venue} />);
    await replace('Anticipo (% del precio)', '50');
    await replace('Depósito desde (minutos reservados)', '90');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar ajustes' }));

    expect(await screen.findByText(/Guardaste los ajustes/)).toBeTruthy();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        depositPercent: 50,
        depositFromMinutes: 90,
        holdMinutes: 60,
        bookingHorizonDays: 30,
      }),
    );
  });

  it('flags out-of-range values inline and does not call the server', async () => {
    render(<VenueSettingsForm venue={venue} />);
    await replace('Anticipo (% del precio)', '150');
    await replace('Reservas con anticipación (días)', '0');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar ajustes' }));

    expect(await screen.findByText('Usa un número entero entre 0 y 100.')).toBeTruthy();
    expect(screen.getByText('Usa entre 1 y 180 días.')).toBeTruthy();
    expect(screen.getByText('Revisa los campos marcados.')).toBeTruthy();
    expect(update).not.toHaveBeenCalled();
  });

  it('refuses to clear a phone that was already set', async () => {
    render(<VenueSettingsForm venue={venue} />);
    await replace('Teléfono o WhatsApp de contacto', '');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar ajustes' }));

    expect(await screen.findByText(/Deja un teléfono/)).toBeTruthy();
    expect(update).not.toHaveBeenCalled();
  });
});
