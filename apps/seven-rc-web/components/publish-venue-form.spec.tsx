// @vitest-environment jsdom
import { SevenRcApiError } from '@17suit/module-seven-reservations-club';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mutateAsync = vi.hoisted(() => vi.fn());
const mutationState = vi.hoisted(() => ({ isPending: false }));
vi.mock('@/lib/owner-queries', () => ({
  useUpdateVenueSettingsMutation: () => ({ mutateAsync, isPending: mutationState.isPending }),
}));

import { PublishVenueForm } from './publish-venue-form';
import type { OwnerVenue } from '@/lib/owner-queries';

function venue(overrides: Partial<OwnerVenue> = {}): OwnerVenue {
  return {
    id: 'v1',
    name: 'Cancha La 70',
    slug: null,
    isPublished: false,
    ...overrides,
  } as OwnerVenue;
}

function renderForm(v: OwnerVenue, missing: string[] = []) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <PublishVenueForm venue={v} missing={missing} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue({});
  mutationState.isPending = false;
});

describe('PublishVenueForm', () => {
  it('suggests a slug from the venue name, without accents', () => {
    renderForm(venue({ name: 'Cancha Él Rincón  #1' }));
    expect(screen.getByLabelText<HTMLInputElement>('Enlace de tu complejo').value).toBe(
      'cancha-el-rincon-1',
    );
  });

  it('blocks publishing until a slug is saved', () => {
    renderForm(venue());
    expect(screen.getByRole<HTMLButtonElement>('switch').disabled).toBe(true);
    expect(screen.getByText('Primero guarda el enlace de tu complejo.')).toBeTruthy();
  });

  it('lists what is missing and keeps the switch disabled', () => {
    renderForm(venue({ slug: 'club' }), ['Al menos una cancha', 'Horario de apertura']);
    expect(screen.getByText('Al menos una cancha')).toBeTruthy();
    expect(screen.getByText('Horario de apertura')).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>('switch').disabled).toBe(true);
  });

  it('publishes when the venue is ready', async () => {
    const user = userEvent.setup();
    renderForm(venue({ slug: 'club' }));
    const toggle = screen.getByRole('switch', { name: /Mostrar mi página/ });
    expect((toggle as HTMLButtonElement).disabled).toBe(false);
    await user.click(toggle);
    expect(mutateAsync).toHaveBeenCalledWith({ isPublished: true });
    expect(await screen.findByText(/Publicaste el complejo/)).toBeTruthy();
  });

  it('unpublishes a published venue even when requirements are missing', async () => {
    const user = userEvent.setup();
    renderForm(venue({ slug: 'club', isPublished: true }), ['Algo']);
    await user.click(screen.getByRole('switch'));
    expect(mutateAsync).toHaveBeenCalledWith({ isPublished: false });
  });

  it.each([
    ['Con Mayúsculas', /sin guiones al inicio/],
    ['con--doble', /sin guiones al inicio/],
    ['-inicio', /sin guiones al inicio/],
  ])('rejects invalid slug %s', async (value, message) => {
    const user = userEvent.setup();
    renderForm(venue());
    const input = screen.getByLabelText('Enlace de tu complejo');
    await user.clear(input);
    await user.type(input, value);
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(screen.getByText(message)).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('requires a slug', async () => {
    const user = userEvent.setup();
    renderForm(venue());
    await user.clear(screen.getByLabelText('Enlace de tu complejo'));
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(screen.getByText('Escribe el enlace de tu complejo.')).toBeTruthy();
  });

  it('saves a new slug', async () => {
    const user = userEvent.setup();
    renderForm(venue());
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(mutateAsync).toHaveBeenCalledWith({ slug: 'cancha-la-70' });
    expect(await screen.findByText('Guardaste el enlace.')).toBeTruthy();
  });

  it('does not call the API when the slug is unchanged', async () => {
    const user = userEvent.setup();
    renderForm(venue({ slug: 'club' }));
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(screen.getByText('Ese ya es el enlace de tu complejo.')).toBeTruthy();
  });

  it('shows a taken-slug error on 409', async () => {
    mutateAsync.mockRejectedValue(new SevenRcApiError('Slug already taken', 409));
    const user = userEvent.setup();
    renderForm(venue());
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(await screen.findByText(/Ese enlace ya lo usa otro complejo/)).toBeTruthy();
  });

  it('shows a mapped error for other failures', async () => {
    mutateAsync.mockRejectedValue(new SevenRcApiError('opaque', 500));
    const user = userEvent.setup();
    renderForm(venue());
    await user.click(screen.getByRole('button', { name: 'Guardar enlace' }));
    expect(await screen.findByText(/servidor tuvo un problema/)).toBeTruthy();
  });

  it('links to the public page once a slug is saved', () => {
    renderForm(venue({ slug: 'club' }));
    expect(screen.getByRole('link', { name: /\/c\/club/ }).getAttribute('href')).toBe('/c/club');
  });
});
