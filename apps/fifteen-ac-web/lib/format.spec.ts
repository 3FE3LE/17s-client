import { describe, expect, it } from 'vitest';

import { formatDate, formatMoney } from './format';

// Snapshot of Intl.NumberFormat('es-CO', {style:'currency',currency:'COP'}).format(n)
// for canonical inputs. Currency formatting uses U+00A0 between the currency
// symbol and the number (per ICU). These literals preserve the NBSP so the
// fixtures match the implementation byte-for-byte.
const COP = {
  pos: '$ 1.234.567',
  neg: '-$ 1.234',
  zero: '$ 0',
  nan: '$ 0',
  inf: '$ 0',
  strnum: '$ 1.234.567',
  strbad: '$ 0',
  usd: 'US$ 1.234,50',
  jpy: 'JPY 1.234',
};

describe('formatMoney', () => {
  it('formats a number using the default COP currency (no fraction digits)', () => {
    expect(formatMoney(1234567)).toBe(COP.pos);
  });

  it('parses a numeric string before formatting', () => {
    expect(formatMoney('1234567')).toBe(COP.strnum);
  });

  it('falls back to 0 when value is not finite (NaN)', () => {
    expect(formatMoney(Number.NaN)).toBe(COP.nan);
  });

  it('falls back to 0 when value is not finite (Infinity)', () => {
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe(COP.inf);
  });

  it('falls back to 0 when value is not finite (unparseable string)', () => {
    expect(formatMoney('not-a-number')).toBe(COP.strbad);
  });

  it('handles zero', () => {
    expect(formatMoney(0)).toBe(COP.zero);
  });

  it('handles negative numbers with default currency', () => {
    expect(formatMoney(-1234)).toBe(COP.neg);
  });

  it('uses fraction digits for non-COP currencies (USD shows 2 fraction digits)', () => {
    // es-CO renders USD as "US$ 1.234,50" — `. ` thousands, `,` decimal.
    expect(formatMoney(1234.5, 'USD')).toBe(COP.usd);
  });

  it('renders the ISO 4217 currency code when not recognized by the locale', () => {
    // JPY is not a currency name es-CO ships with; Intl falls back to ISO code.
    expect(formatMoney(1234, 'JPY')).toBe(COP.jpy);
  });
});

describe('formatDate', () => {
  it('formats an ISO date string using the es-CO locale', () => {
    // Output is timezone-sensitive on the test runner host, so we assert on
    // the structure rather than an exact string.
    const result = formatDate('2026-06-30T12:00:00Z');
    expect(result).toMatch(/^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
    expect(result).toContain('jun');
    expect(result).toContain('2026');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats an ISO date string with date-only components', () => {
    const result = formatDate('2025-01-15');
    expect(result).toMatch(/^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
    expect(result).toContain('2025');
  });
});
