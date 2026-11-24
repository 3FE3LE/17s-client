// @vitest-environment jsdom
import { SevenRcApiError } from '@17suit/module-seven-reservations-club';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mutateAsync = vi.hoisted(() => vi.fn());
const mutationState = vi.hoisted(() => ({ isPending: false }));
vi.mock('@/lib/owner-queries', () => ({
  useCreateVenuePitchMutation: () => ({ mutateAsync, isPending: mutationState.isPending }),
}));

import { CreatePitchForm } from './create-pitch-form';

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue({ name: 'Cancha 1' });
  mutationState.isPending = false;
});

function fill(overrides: { name?: string; capacity?: string; duration?: string }) {
  return async (user: ReturnType<typeof userEvent.setup>) => {
    if (overrides.name !== undefined) {
      const input = screen.getByLabelText('Nombre de la cancha');
      await user.clear(input);
      if (overrides.name) await user.type(input, overrides.name);
    }
    if (overrides.capacity !== undefined) {
      const input = screen.getByLabelText('Capacidad (jugadores)');
      await user.clear(input);
      await user.type(input, overrides.capacity);
    }
    if (overrides.duration !== undefined) {
      const input = screen.getByLabelText('Duración del turno (minutos)');
      await user.clear(input);
      await user.type(input, overrides.duration);
    }
  };
}

const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'Agregar cancha' }));

describe('CreatePitchForm', () => {
  it('sends the trimmed pitch and confirms it', async () => {
    const user = userEvent.setup();
    render(<CreatePitchForm venueId="v1" venueName="Complejo A" />);
    await fill({ name: '  Cancha 1  ', capacity: '14', duration: '90' })(user);
    await submit(user);
    expect(mutateAsync).toHaveBeenCalledWith({
      name: 'Cancha 1',
      sportType: 'futbol-5',
      capacity: 14,
      slotDurationMinutes: 90,
    });
    expect(await screen.findByText(/Agregaste “Cancha 1”/)).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Nombre de la cancha').value).toBe('');
  });

  it('rejects a short name inline without calling the server', async () => {
    const user = userEvent.setup();
    render(<CreatePitchForm venueId="v1" venueName="Complejo A" />);
    await fill({ name: 'A' })(user);
    await submit(user);
    expect(screen.getByRole('alert').textContent).toMatch(/al menos 2 caracteres/);
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  // The number inputs carry min/max, so the browser blocks the submit before our handler runs.
  it.each([
    ['Capacidad (jugadores)', '0', { capacity: '0' }],
    ['Capacidad (jugadores)', '101', { capacity: '101' }],
    ['Duración del turno (minutos)', '29', { duration: '29' }],
    ['Duración del turno (minutos)', '241', { duration: '241' }],
  ])('blocks %s = %s before reaching the server', async (label, _value, values) => {
    const user = userEvent.setup();
    render(<CreatePitchForm venueId="v1" venueName="Complejo A" />);
    await fill({ name: 'Cancha 1', ...values })(user);
    await submit(user);
    expect(screen.getByLabelText<HTMLInputElement>(label).validity.valid).toBe(false);
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('shows the server error and keeps the typed name', async () => {
    mutateAsync.mockRejectedValue(new SevenRcApiError('Only venue owner can manage pitches', 403));
    const user = userEvent.setup();
    render(<CreatePitchForm venueId="v1" venueName="Complejo A" />);
    await fill({ name: 'Cancha 1' })(user);
    await submit(user);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Nombre de la cancha').value).toBe('Cancha 1');
  });

  it('disables the button while saving', () => {
    mutationState.isPending = true;
    render(<CreatePitchForm venueId="v1" venueName="Complejo A" />);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Guardando…' }).disabled).toBe(
      true,
    );
  });
});
