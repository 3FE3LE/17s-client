// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentForm } from './payment-form';
import type { VenueReservation } from '@/lib/owner-queries';

const onSubmit = vi.fn<(input: unknown) => Promise<void>>();

const reservation = {
  id: 'r1',
  status: 'pending_confirmation',
  currency: 'COP',
  priceMinor: 10_000_000,
  depositMinor: 3_000_000,
  paidMinor: 1_000_000,
  customerName: 'Los Pibes',
  user: null,
  pitch: { name: 'Cancha 1' },
  startAt: '2099-01-10T15:00:00.000Z',
  endAt: '2099-01-10T16:00:00.000Z',
} as unknown as VenueReservation;

function renderForm() {
  render(
    <PaymentForm
      reservation={reservation}
      timeZone="America/Bogota"
      isPending={false}
      onCancel={vi.fn()}
      onSubmit={onSubmit}
    />,
  );
}

beforeEach(() => {
  onSubmit.mockReset();
  onSubmit.mockResolvedValue(undefined);
});

describe('PaymentForm', () => {
  it('prefills the deposit still due and submits it', async () => {
    renderForm();
    expect(screen.getByLabelText<HTMLInputElement>(/Monto/).value).toBe('20.000');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));

    expect(onSubmit).toHaveBeenCalledWith({
      kind: 'deposit',
      method: 'transfer',
      amountMinor: 2_000_000,
    });
  });

  it('rejects an empty amount inline', async () => {
    renderForm();
    await userEvent.clear(screen.getByLabelText(/Monto/));
    await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));

    expect(await screen.findByText('Escribe un monto mayor que cero, p. ej. 30.000.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('refuses a refund above what was paid', async () => {
    renderForm();
    await userEvent.selectOptions(screen.getByLabelText('Concepto'), 'refund');
    await userEvent.clear(screen.getByLabelText(/Monto/));
    await userEvent.type(screen.getByLabelText(/Monto/), '50.000');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));

    expect(
      await screen.findByText('La devolución supera lo que el jugador ha pagado.'),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows the server error without losing the form', async () => {
    onSubmit.mockRejectedValue(new Error('boom'));
    renderForm();
    await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));

    expect(await screen.findByText(/No se pudo registrar el pago/)).toBeTruthy();
  });
});
