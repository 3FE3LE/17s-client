import { describe, expect, it } from 'vitest';
import { authFieldError } from './auth-validation';

const t = (key: string) => `t:${key}`;

describe('authFieldError', () => {
  it('maps schema keys to catalog keys', () => {
    expect(authFieldError(t, 'emailInvalid')).toBe('t:account.validation.emailInvalid');
    expect(authFieldError(t, 'passwordMismatch')).toBe('t:account.validation.passwordMismatch');
  });

  it('ignores unknown or missing keys', () => {
    expect(authFieldError(t, undefined)).toBeUndefined();
    expect(authFieldError(t, 'something else')).toBeUndefined();
  });
});
