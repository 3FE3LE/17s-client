import { describe, expect, it } from 'vitest';
import {
  asDepositPolicy,
  buildVenueEditSchema,
  normalizePhone,
  toVenueEditInput,
  type VenueEditValues,
} from './venue-edit-schema';

const emptyAddress = {
  viaTipo: '',
  viaNumero: '',
  cruceNumero: '',
  placaNumero: '',
  complemento: '',
  barrio: '',
  municipio: '',
  departamento: '',
} as const;

const valid = (over: Partial<VenueEditValues> = {}): VenueEditValues => ({
  name: 'Complejo Norte',
  address: { ...emptyAddress },
  contactPhone: '300 123 4567',
  paymentInstructions: 'Nequi 300',
  depositPercent: '30',
  holdMinutes: '60',
  cancellationWindowHours: '24',
  lateCancelDeposit: 'owner_decides',
  noShowDeposit: 'retain',
  conditionsText: '',
  bookingHorizonDays: '30',
  ...over,
});

const errorsOf = (values: VenueEditValues, hadPhone = false) => {
  const result = buildVenueEditSchema('CO', hadPhone).safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => [i.path.join('.'), i.message]);
};

describe('asDepositPolicy', () => {
  it('keeps valid values and defaults otherwise', () => {
    expect(asDepositPolicy('refund')).toBe('refund');
    expect(asDepositPolicy('retain')).toBe('retain');
    expect(asDepositPolicy('weird')).toBe('owner_decides');
  });
});

describe('normalizePhone', () => {
  it('returns null for blank input', () => {
    expect(normalizePhone('   ', 'CO')).toBeNull();
  });

  it('keeps international numbers, stripping separators', () => {
    expect(normalizePhone('+57 (300) 123-4567', 'CO')).toBe('+573001234567');
  });

  it('prefixes local Colombian mobiles only', () => {
    expect(normalizePhone('300 123 4567', 'CO')).toBe('+573001234567');
    expect(normalizePhone('300 123 4567', 'MX')).toBe('3001234567');
    expect(normalizePhone('2001234567', 'CO')).toBe('2001234567');
  });
});

describe('buildVenueEditSchema', () => {
  it('accepts valid values', () => {
    expect(errorsOf(valid())).toEqual([]);
  });

  it('validates name length', () => {
    expect(errorsOf(valid({ name: ' ab ' }))).toContainEqual(['name', 'nameMin']);
    expect(errorsOf(valid({ name: 'x'.repeat(121) }))).toContainEqual(['name', 'nameMax']);
  });

  it('validates text limits', () => {
    expect(errorsOf(valid({ paymentInstructions: 'x'.repeat(501) }))).toContainEqual([
      'paymentInstructions',
      'paymentInstructionsMax',
    ]);
    expect(errorsOf(valid({ conditionsText: 'x'.repeat(1001) }))).toContainEqual([
      'conditionsText',
      'conditionsMax',
    ]);
  });

  it('validates numeric ranges', () => {
    const issues = errorsOf(
      valid({
        depositPercent: '101',
        holdMinutes: '4',
        cancellationWindowHours: '169',
        bookingHorizonDays: '0',
      }),
    );
    expect(issues).toEqual(
      expect.arrayContaining([
        ['depositPercent', 'depositPercent'],
        ['holdMinutes', 'holdMinutes'],
        ['cancellationWindowHours', 'cancellationWindowHours'],
        ['bookingHorizonDays', 'bookingHorizonDays'],
      ]),
    );
    expect(errorsOf(valid({ depositPercent: '1.5' }))).toContainEqual([
      'depositPercent',
      'depositPercent',
    ]);
  });

  it('validates phone format and blocks clearing a saved phone', () => {
    expect(errorsOf(valid({ contactPhone: '12345' }))).toContainEqual([
      'contactPhone',
      'phoneFormat',
    ]);
    expect(errorsOf(valid({ contactPhone: '' }))).toEqual([]);
    expect(errorsOf(valid({ contactPhone: '' }), true)).toContainEqual([
      'contactPhone',
      'phoneRequired',
    ]);
  });

  it('rejects an unknown deposit policy', () => {
    expect(
      errorsOf(valid({ lateCancelDeposit: 'bogus' as VenueEditValues['lateCancelDeposit'] })),
    ).toContainEqual(['lateCancelDeposit', expect.any(String)]);
  });
});

describe('toVenueEditInput', () => {
  it('builds the request body with trimmed text and numbers', () => {
    const body = toVenueEditInput(
      valid({ name: '  Norte  ', paymentInstructions: ' pay ', conditionsText: ' c ' }),
      'CO',
    );
    expect(body).toEqual({
      name: 'Norte',
      contactPhone: '+573001234567',
      paymentInstructions: 'pay',
      depositPercent: 30,
      holdMinutes: 60,
      cancellationWindowHours: 24,
      lateCancelDeposit: 'owner_decides',
      noShowDeposit: 'retain',
      conditionsText: 'c',
      bookingHorizonDays: 30,
    });
  });

  it('omits phone and address when empty', () => {
    const body = toVenueEditInput(valid({ contactPhone: '' }), 'CO');
    expect(body).not.toHaveProperty('contactPhone');
    expect(body).not.toHaveProperty('addressParts');
  });
});
