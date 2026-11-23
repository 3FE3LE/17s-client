import { describe, expect, it } from 'vitest';
import { E164_PATTERN, normalizePhone } from './phone';

describe('normalizePhone', () => {
  it('returns null for empty or whitespace input', () => {
    expect(normalizePhone('', 'CO')).toBeNull();
    expect(normalizePhone('   ', 'CO')).toBeNull();
  });

  it('strips separators from an international number', () => {
    expect(normalizePhone('+57 (300) 123-4567', 'CO')).toBe('+573001234567');
  });

  it('prefixes +57 to a local Colombian mobile', () => {
    expect(normalizePhone('300 123 4567', 'CO')).toBe('+573001234567');
  });

  it('does not prefix a local number for other countries', () => {
    expect(normalizePhone('300 123 4567', 'MX')).toBe('3001234567');
  });

  it('does not prefix a Colombian number that is not a 10-digit mobile', () => {
    expect(normalizePhone('601 234 5678', 'CO')).toBe('6012345678');
  });
});

describe('E164_PATTERN', () => {
  it.each(['+573001234567', '+12025550123', '+34911234567'])('accepts %s', (value) => {
    expect(E164_PATTERN.test(value)).toBe(true);
  });

  it.each(['3001234567', '+0123456789', '+57300', '+5730012345678901', '+57 300 123 4567'])(
    'rejects %s',
    (value) => {
      expect(E164_PATTERN.test(value)).toBe(false);
    },
  );
});
