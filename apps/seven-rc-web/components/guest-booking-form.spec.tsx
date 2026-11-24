// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const reserveAction = vi.hoisted(() => vi.fn());
vi.mock('@/app/c/[slug]/actions', () => ({ reserveAction }));

import { GuestBookingForm, type GuestBookingFormProps } from './guest-booking-form';

const PROPS: GuestBookingFormProps = {
  slug: 'club',
  date: '2026-11-22',
  pitchId: '123e4567-e89b-42d3-a456-426614174000',
  startAt: '2026-11-23T00:00:00.000Z',
  when: 'sábado 22 de noviembre · 7:00 p. m. – 8:00 p. m.',
  pitchName: 'Cancha 1',
  priceLabel: '$80.000',
  depositPercent: 0,
  depositLabel: '$0',
  holdMinutes: 30,
  policyVersion: 2,
};

beforeEach(() => {
  reserveAction.mockReset();
  reserveAction.mockResolvedValue({ fieldErrors: {}, formError: null });
});

describe('GuestBookingForm', () => {
  it('shows the slot summary and instant confirmation without a deposit', () => {
    render(<GuestBookingForm {...PROPS} />);
    expect(screen.getByText(/Cancha 1 · sábado 22 de noviembre/)).toBeTruthy();
    expect(screen.getByText('$80.000')).toBeTruthy();
    expect(screen.getByText('No pide anticipo')).toBeTruthy();
    expect(screen.getByText('Tu reserva se confirma al instante.')).toBeTruthy();
  });

  it('explains the hold window when a deposit is required', () => {
    render(
      <GuestBookingForm {...PROPS} depositPercent={30} depositLabel="$24.000" holdMinutes={90} />,
    );
    expect(screen.getByText('$24.000 (30 %)')).toBeTruthy();
    expect(screen.getByText(/1 hora y 30 minutos/)).toBeTruthy();
  });

  it('labels fields and carries the slot in hidden inputs', () => {
    const { container } = render(<GuestBookingForm {...PROPS} />);
    expect(screen.getByLabelText('Tu nombre').getAttribute('autocomplete')).toBe('name');
    expect(screen.getByLabelText('Tu teléfono o WhatsApp').getAttribute('type')).toBe('tel');
    expect((container.querySelector('input[name="pitchId"]') as HTMLInputElement).value).toBe(
      PROPS.pitchId,
    );
    expect((container.querySelector('input[name="startAt"]') as HTMLInputElement).value).toBe(
      PROPS.startAt,
    );
    expect((container.querySelector('input[name="fecha"]') as HTMLInputElement).value).toBe(
      PROPS.date,
    );
    expect((container.querySelector('input[name="policyVersion"]') as HTMLInputElement).value).toBe(
      String(PROPS.policyVersion),
    );
  });

  it('submits the typed values to reserveAction bound to the slug', async () => {
    const user = userEvent.setup();
    render(<GuestBookingForm {...PROPS} />);
    await user.type(screen.getByLabelText('Tu nombre'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Tu teléfono o WhatsApp'), '300 123 4567');
    await user.click(screen.getByRole('button', { name: 'Reservar' }));

    expect(reserveAction).toHaveBeenCalledTimes(1);
    const [slug, , data] = reserveAction.mock.calls[0] as [string, unknown, FormData];
    expect(slug).toBe('club');
    expect(data.get('customerName')).toBe('Ana Pérez');
    expect(data.get('customerPhone')).toBe('300 123 4567');
    expect(data.get('pitchId')).toBe(PROPS.pitchId);
  });

  it('renders field and form errors and keeps typed values after a failed submit', async () => {
    reserveAction.mockResolvedValue({
      fieldErrors: { name: 'Escribe tu nombre.', phone: 'Número inválido.' },
      formError: 'Revisa los campos marcados.',
    });
    const user = userEvent.setup();
    render(<GuestBookingForm {...PROPS} />);
    await user.type(screen.getByLabelText('Tu nombre'), 'A');
    await user.click(screen.getByRole('button', { name: 'Reservar' }));

    expect(await screen.findByText('Revisa los campos marcados.')).toBeTruthy();
    expect(screen.getByText('Escribe tu nombre.')).toBeTruthy();
    expect(screen.getByText('Número inválido.')).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Tu nombre').value).toBe('A');
  });
});
