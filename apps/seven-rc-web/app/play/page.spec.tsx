// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/play',
  useSearchParams: () => new URLSearchParams(),
}));

const role = vi.hoisted(() => ({ value: 'PLAYER', isLoading: false }));
vi.mock('@17suit/module-seven-reservations-club/client', () => ({
  useCurrentUserRoleQuery: () => ({ role: role.value, isLoading: role.isLoading }),
  useRoleGate: vi.fn(),
}));

const venuesQuery = vi.hoisted(() => vi.fn());
const query = (data: unknown) => ({
  data,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
});
vi.mock('@/lib/player-queries', () => ({
  usePlayerVenuesQuery: (term?: string) => {
    venuesQuery(term);
    return query([]);
  },
  usePlayerVenuePitchesQuery: () => query([]),
  usePitchAvailabilityQuery: () => query(undefined),
  useMyReservationsQuery: () => query([]),
  useCreateReservationMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useCancelReservationMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

import PlayPage from './page';

beforeEach(() => {
  role.value = 'PLAYER';
  role.isLoading = false;
  venuesQuery.mockClear();
});

describe('/play page', () => {
  it('shows the account skeleton while the role loads and mounts no player queries', () => {
    role.value = '';
    role.isLoading = true;
    render(<PlayPage />);

    expect(screen.getByText('Cargando tu cuenta…')).toBeTruthy();
    expect(venuesQuery).not.toHaveBeenCalled();
  });

  it('keeps a non-player on the skeleton instead of rendering the booking flow', () => {
    role.value = 'OWNER';
    render(<PlayPage />);

    expect(screen.getByText('Cargando tu cuenta…')).toBeTruthy();
    expect(screen.queryByLabelText('Buscar complejo')).toBeNull();
    expect(venuesQuery).not.toHaveBeenCalled();
  });

  it('renders the search and the empty venue state for a player', () => {
    render(<PlayPage />);

    expect(screen.getByLabelText('Buscar complejo')).toBeTruthy();
    expect(screen.getByText('Todavía no hay complejos publicados')).toBeTruthy();
    expect(venuesQuery).toHaveBeenCalledWith(undefined);
  });

  it('commits the trimmed search term on submit', async () => {
    render(<PlayPage />);
    await userEvent.type(screen.getByLabelText('Buscar complejo'), '  La 70  {Enter}');

    expect(venuesQuery).toHaveBeenLastCalledWith('La 70');
  });
});
