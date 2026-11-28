import type { AuthErrorKey } from '@17suit/core';
import type { MobileT } from './i18n';

const AUTH_ERROR_KEYS: Record<AuthErrorKey, true> = {
  emailRequired: true,
  emailInvalid: true,
  passwordRequired: true,
  passwordTooShort: true,
  confirmRequired: true,
  passwordMismatch: true,
  codeRequired: true,
};

/** Resolve a zod message key from `@17suit/core` auth schemas to screen text. */
export function authErrorText(key: string | undefined, t: MobileT): string | null {
  if (!key) return null;
  return key in AUTH_ERROR_KEYS ? t(`authFields.${key}`) : t('authFields.invalid');
}
