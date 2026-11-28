// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock('@/lib/owner-queries', () => ({
  useConfigurePitchPolicyMutation: () => ({ mutateAsync, isPending: false }),
}));

import { PitchPolicyForm, parseOptionalInt } from './pitch-policy-form';

const VENUE = {
  depositPercent: 30,
  depositFromMinutes: 0,
  holdMinutes: 60,
  cancellationWindowHours: 24,
  paymentInstructions: null,
  lateCancelDeposit: 'retain',
  noShowDeposit: 'owner_decides',
  conditionsText: null,
} as const;
const PITCH = {
  id: 'p1',
  name: 'Cancha 1',
  depositPercent: null,
  depositFromMinutes: null,
  holdMinutes: null,
  cancellationWindowHours: null,
  paymentInstructions: null,
  lateCancelDeposit: null,
  noShowDeposit: null,
  conditionsText: null,
} as unknown as Parameters<typeof PitchPolicyForm>[0]['pitch'];

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue({});
});

describe('PitchPolicyForm', () => {
  it('rejects an out-of-range value inline without calling the server', async () => {
    const user = userEvent.setup();
    render(<PitchPolicyForm venueId="v1" venue={VENUE} pitch={PITCH} />);
    await user.type(screen.getByLabelText('Anticipo (% del precio)'), '150');
    await user.click(screen.getByRole('button', { name: 'Guardar condiciones' }));

    expect(await screen.findByText('Usa un número entero entre 0 y 100.')).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('sends null for blank fields (inherit) and the number for own values', async () => {
    const user = userEvent.setup();
    render(<PitchPolicyForm venueId="v1" venue={VENUE} pitch={PITCH} />);
    await user.type(screen.getByLabelText('Anticipo (% del precio)'), '0');
    await user.type(screen.getByLabelText('Depósito desde (minutos reservados)'), '120');
    await user.click(screen.getByRole('button', { name: 'Guardar condiciones' }));

    expect(await screen.findByText(/Guardaste las condiciones de Cancha 1/)).toBeTruthy();
    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        depositPercent: 0,
        depositFromMinutes: 120,
        holdMinutes: null,
        lateCancelDeposit: null,
      }),
    );
  });
});

describe('parseOptionalInt', () => {
  it('treats blank as inherit (null)', () => {
    expect(parseOptionalInt('', 0, 100)).toBeNull();
    expect(parseOptionalInt('   ', 0, 100)).toBeNull();
  });

  it('keeps 0 as an own value, not as inherit', () => {
    expect(parseOptionalInt('0', 0, 100)).toBe(0);
  });

  it('rejects out of range and non integers', () => {
    expect(parseOptionalInt('101', 0, 100)).toBe('invalid');
    expect(parseOptionalInt('4', 5, 1440)).toBe('invalid');
    expect(parseOptionalInt('1.5', 0, 100)).toBe('invalid');
    expect(parseOptionalInt('-1', 0, 100)).toBe('invalid');
    expect(parseOptionalInt('abc', 0, 100)).toBe('invalid');
  });
});
