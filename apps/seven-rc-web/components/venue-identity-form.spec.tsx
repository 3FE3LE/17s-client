// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useUpdateVenueSettingsMutation: () => ({ mutateAsync, isPending: false }),
}));
vi.mock('@17suit/ui/feedback', () => ({
  runAction: async (action: () => Promise<unknown>) => {
    try {
      return { ok: true, value: await action() };
    } catch (error) {
      return { ok: false, error };
    }
  },
}));

import { VenueIdentityForm } from './venue-identity-form';

const VENUE = {
  id: 'v1',
  name: 'Club Norte',
  address: 'Calle 1',
  addressParts: null,
} as unknown as Parameters<typeof VenueIdentityForm>[0]['venue'];

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue({});
});

describe('VenueIdentityForm', () => {
  it('blocks a short name inline and never calls the server', async () => {
    const user = userEvent.setup();
    render(<VenueIdentityForm venue={VENUE} />);
    const name = screen.getByLabelText('Nombre del complejo');
    await user.clear(name);
    await user.type(name, 'ab');
    await user.click(screen.getByRole('button', { name: 'Guardar datos' }));

    expect(await screen.findByText(/al menos 3 caracteres/)).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('flags a half-filled address and saves a valid one', async () => {
    const user = userEvent.setup();
    render(<VenueIdentityForm venue={VENUE} />);
    await user.type(screen.getByLabelText('Número de la vía'), '72');
    await user.click(screen.getByRole('button', { name: 'Guardar datos' }));
    expect(await screen.findByText('Elige el tipo de vía.')).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('saves name only when the address stays empty', async () => {
    const user = userEvent.setup();
    render(<VenueIdentityForm venue={VENUE} />);
    await user.click(screen.getByRole('button', { name: 'Guardar datos' }));

    expect(await screen.findByText('Datos del complejo guardados.')).toBeTruthy();
    expect(mutateAsync).toHaveBeenCalledWith({ name: 'Club Norte' });
  });
});
