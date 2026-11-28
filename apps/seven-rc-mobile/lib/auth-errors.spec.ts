import { describe, expect, it } from 'vitest';
import { authErrorText } from './auth-errors';
import { tEn, tEs } from './__tests__/test-translate';

describe('authErrorText', () => {
  it('returns null without a key', () => {
    expect(authErrorText(undefined, tEs)).toBeNull();
    expect(authErrorText('', tEs)).toBeNull();
  });

  it('maps known core keys to the catalog in both locales', () => {
    expect(authErrorText('emailRequired', tEn)).toBe('Enter your email.');
    expect(authErrorText('passwordMismatch', tEn)).toBe('The passwords do not match.');
    const es = authErrorText('codeRequired', tEs);
    expect(es).toBe(tEs('authFields.codeRequired'));
    expect(es).not.toBe(tEn('authFields.codeRequired'));
  });

  it('falls back to the generic message for unknown keys', () => {
    expect(authErrorText('nope', tEn)).toBe(tEn('authFields.invalid'));
    expect(authErrorText('nope', tEs)).toBe(tEs('authFields.invalid'));
  });
});
