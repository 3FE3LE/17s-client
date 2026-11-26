// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const configure = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useConfigurePitchPricingMutation: () => ({ mutateAsync: configure, isPending: false }),
}));

import { PitchPriceForm } from './pitch-price-form';
import type { PitchWithPricing } from '@/lib/owner-queries';

const pitch = {
  id: 'p1',
  name: 'Cancha 1',
  basePriceMinor: 8_000_000,
  slotDurationMinutes: 60,
  priceRules: [{ daysOfWeek: [5], startTime: '19:00', endTime: '22:00', priceMinor: 10_000_000 }],
} as unknown as PitchWithPricing;

beforeEach(() => {
  configure.mockReset();
  configure.mockResolvedValue({});
});

describe('PitchPriceForm', () => {
  it('saves the base price and carries the rules over', async () => {
    render(<PitchPriceForm venueId="v1" currency="COP" pitch={pitch} />);
    const input = screen.getByLabelText(/Precio de un turno/);
    await userEvent.clear(input);
    await userEvent.type(input, '90.000');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(await screen.findByText(/Cancha 1 cuesta/)).toBeTruthy();
    expect(configure).toHaveBeenCalledWith({
      basePriceMinor: 9_000_000,
      rules: [{ daysOfWeek: [5], startTime: '19:00', endTime: '22:00', priceMinor: 10_000_000 }],
    });
  });

  it('allows clearing the price', async () => {
    render(<PitchPriceForm venueId="v1" currency="COP" pitch={pitch} />);
    await userEvent.clear(screen.getByLabelText(/Precio de un turno/));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(await screen.findByText(/quedó sin precio base/)).toBeTruthy();
    expect(configure).toHaveBeenCalledWith(expect.objectContaining({ basePriceMinor: 0 }));
  });

  it('rejects an unparsable price inline', async () => {
    render(<PitchPriceForm venueId="v1" currency="COP" pitch={pitch} />);
    const input = screen.getByLabelText(/Precio de un turno/);
    await userEvent.clear(input);
    await userEvent.type(input, 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(await screen.findByText(/Escribe un precio válido/)).toBeTruthy();
    expect(configure).not.toHaveBeenCalled();
  });
});
