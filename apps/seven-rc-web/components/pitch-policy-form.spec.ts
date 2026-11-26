import { describe, expect, it } from 'vitest';
import { parseOptionalInt } from './pitch-policy-form';

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
