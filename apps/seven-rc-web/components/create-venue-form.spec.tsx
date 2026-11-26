// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useCreateVenueMutation: () => ({ mutateAsync: create, isPending: false }),
}));

import { CreateVenueForm } from './create-venue-form';

const onCreated = vi.fn();

beforeEach(() => {
  create.mockReset();
  onCreated.mockReset();
  create.mockResolvedValue({ id: 'v9', name: 'Nuevo' });
});

describe('CreateVenueForm', () => {
  it('asks for a name of at least 3 characters and never calls the server', async () => {
    render(<CreateVenueForm onCreated={onCreated} />);
    await userEvent.type(screen.getByLabelText(/Nombre del complejo/), 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Crear complejo' }));

    expect(
      await screen.findByText('El nombre del complejo necesita al menos 3 caracteres.'),
    ).toBeTruthy();
    expect(screen.getByText('Revisa los campos marcados.')).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the venue without an address and reports the new id', async () => {
    render(<CreateVenueForm onCreated={onCreated} />);
    await userEvent.type(screen.getByLabelText(/Nombre del complejo/), 'Nuevo');
    await userEvent.click(screen.getByRole('button', { name: 'Crear complejo' }));

    expect(await screen.findByText(/Creaste “Nuevo”/)).toBeTruthy();
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nuevo' }));
    expect(onCreated).toHaveBeenCalledWith('v9');
  });
});
