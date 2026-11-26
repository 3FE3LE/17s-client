import { describe, expect, it } from 'vitest';

import { resetPasswordSchema, signInSchema, signUpSchema } from './auth-schemas';

const firstKey = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message;

describe('auth schemas', () => {
  it('rejects empty and malformed emails with stable keys', () => {
    expect(firstKey(signInSchema.safeParse({ email: '', password: 'x' }))).toBe('emailRequired');
    expect(firstKey(signInSchema.safeParse({ email: 'a@b', password: 'x' }))).toBe('emailInvalid');
  });

  it('trims the email', () => {
    const parsed = signInSchema.parse({ email: ' a@b.co ', password: 'x' });
    expect(parsed.email).toBe('a@b.co');
  });

  it('enforces an 8 character password and matching confirmation on sign-up', () => {
    const base = { email: 'a@b.co', password: 'short', confirmPassword: 'short' };
    expect(firstKey(signUpSchema.safeParse(base))).toBe('passwordTooShort');
    expect(
      firstKey(
        signUpSchema.safeParse({ ...base, password: 'longenough', confirmPassword: 'other' }),
      ),
    ).toBe('passwordMismatch');
    expect(
      signUpSchema.safeParse({ ...base, password: 'longenough', confirmPassword: 'longenough' })
        .success,
    ).toBe(true);
  });

  it('requires the code and a valid new password on reset', () => {
    expect(
      firstKey(
        resetPasswordSchema.safeParse({
          code: ' ',
          password: 'longenough',
          confirmPassword: 'longenough',
        }),
      ),
    ).toBe('codeRequired');
  });
});
