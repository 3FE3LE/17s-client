import { describe, expect, it } from 'vitest';
import { asDepositPolicy, policySummaryLines } from './deposit-policy';

describe('deposit policy copy', () => {
  it('summarizes the window and both deposit rules', () => {
    expect(
      policySummaryLines({
        cancellationWindowHours: 24,
        lateCancelDeposit: 'retain',
        noShowDeposit: 'owner_decides',
      }),
    ).toEqual([
      'Puedes cancelar en línea hasta 24 horas antes del turno.',
      'Si cancelas tarde: el complejo conserva el anticipo.',
      'Si no llegas y no avisas: el complejo decide qué pasa con el anticipo.',
    ]);
  });

  it('uses the singular hour and the no-window wording', () => {
    expect(
      policySummaryLines({
        cancellationWindowHours: 1,
        lateCancelDeposit: 'refund',
        noShowDeposit: 'refund',
      })[0],
    ).toBe('Puedes cancelar en línea hasta 1 hora antes del turno.');
    expect(
      policySummaryLines({
        cancellationWindowHours: 0,
        lateCancelDeposit: 'refund',
        noShowDeposit: 'refund',
      })[0],
    ).toBe('Puedes cancelar en línea hasta el inicio del turno.');
  });

  it('reads unknown values as owner decides', () => {
    expect(asDepositPolicy('refund')).toBe('refund');
    expect(asDepositPolicy('weird')).toBe('owner_decides');
  });
});
