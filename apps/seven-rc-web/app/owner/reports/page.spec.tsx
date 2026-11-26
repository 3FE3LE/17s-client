// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }) }));
vi.mock('@17suit/module-seven-reservations-club/client', () => ({
  useCurrentUserRoleQuery: () => ({ role: 'OWNER', isLoading: false }),
  useRoleGate: vi.fn(),
}));
const reportQuery = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useOwnerVenuesQuery: () => ({
    data: [{ id: 'v1', name: 'Complejo', slug: 'c', currency: 'COP', timezone: 'America/Bogota' }],
    error: null,
  }),
  useOwnerVenueReportQuery: (...args: unknown[]) => {
    reportQuery(...args);
    return { data: null, isLoading: false, error: null, refetch: vi.fn() };
  },
  useOwnerVenueReservationsQuery: () => ({ data: null, isLoading: false, error: null }),
}));

import OwnerReportsPage from './page';

beforeEach(() => reportQuery.mockClear());

describe('reports period form', () => {
  it('rejects an end date before the start inline and keeps the applied period', async () => {
    render(<OwnerReportsPage />);
    const to = screen.getByLabelText('Hasta');
    await userEvent.clear(to);
    await userEvent.type(to, '2000-01-01');
    const calls = reportQuery.mock.calls.length;
    await userEvent.click(screen.getByRole('button', { name: 'Ver reporte' }));

    expect(
      await screen.findByText('La fecha de fin no puede ser anterior a la de inicio.'),
    ).toBeTruthy();
    expect(reportQuery.mock.calls.slice(calls).every((c) => c[2] !== '2000-01-01')).toBe(true);
  });

  it('applies a preset period', async () => {
    render(<OwnerReportsPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Últimos 7 días' }));
    const [, from = '', to = ''] = reportQuery.mock.calls.at(-1) as string[];
    expect(from < to).toBe(true);
  });
});
