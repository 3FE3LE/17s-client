// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useConfigurePitchPricingMutation: () => ({ mutateAsync, isPending: false }),
}));

import { PitchPriceRules } from './pitch-price-rules';
import type { PitchWithPricing } from '@/lib/owner-queries';

function rule(id: string, o: Record<string, unknown> = {}) {
  return {
    id,
    pitchId: 'p1',
    daysOfWeek: [5],
    startTime: '19:00',
    endTime: '22:00',
    priceMinor: 15_000_000,
    ...o,
  };
}

function pitch(priceRules: ReturnType<typeof rule>[]): PitchWithPricing {
  return {
    id: 'p1',
    name: 'Cancha 1',
    basePriceMinor: 10_000_000,
    slotDurationMinutes: 60,
    openingHours: { '5': { openTime: '17:00', closeTime: '23:00' } },
    priceRules,
  } as unknown as PitchWithPricing;
}

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue({});
});

describe('PitchPriceRules', () => {
  it('blocks saving overlapping rules and names them', async () => {
    render(
      <PitchPriceRules
        venueId="v1"
        currency="COP"
        pitch={pitch([rule('a'), rule('b', { startTime: '21:00', endTime: '23:00' })])}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Guardar tarifas' }));
    expect(await screen.findByText(/reglas 1 y 2 se solapan/i)).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('saves valid rules keeping the stored base price', async () => {
    render(<PitchPriceRules venueId="v1" currency="COP" pitch={pitch([rule('a')])} />);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar tarifas' }));
    expect(mutateAsync).toHaveBeenCalledWith({
      basePriceMinor: 10_000_000,
      rules: [{ daysOfWeek: [5], startTime: '19:00', endTime: '22:00', priceMinor: 15_000_000 }],
    });
  });

  it('removes a rule and shows the effective price per slot', async () => {
    render(<PitchPriceRules venueId="v1" currency="COP" pitch={pitch([rule('a')])} />);
    expect(screen.getByText(/19:00–22:00/)).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Quitar tarifa 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar tarifas' }));
    expect(mutateAsync).toHaveBeenCalledWith({ basePriceMinor: 10_000_000, rules: [] });
  });

  it('rejects a rule without days', async () => {
    render(<PitchPriceRules venueId="v1" currency="COP" pitch={pitch([])} />);
    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarifa' }));
    await userEvent.type(screen.getByLabelText(/Precio por turno/), '150000');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar tarifas' }));
    expect(await screen.findByText(/Elige al menos un día/)).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
