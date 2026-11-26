import type { AuthErrorKey } from '@17suit/core';

const KEYS: readonly AuthErrorKey[] = [
  'emailRequired',
  'emailInvalid',
  'passwordRequired',
  'passwordTooShort',
  'confirmRequired',
  'passwordMismatch',
  'codeRequired',
];

/** Maps a zod message key from `@17suit/core` auth schemas to catalog text. */
export function authFieldError(
  t: (key: string) => string,
  key: string | undefined,
): string | undefined {
  if (!key) return undefined;
  return KEYS.includes(key as AuthErrorKey) ? t(`account.validation.${key}`) : undefined;
}
