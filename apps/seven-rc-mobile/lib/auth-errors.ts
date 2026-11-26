import type { AuthErrorKey } from '@17suit/core';

const AUTH_ERRORS: Record<AuthErrorKey, string> = {
  emailRequired: 'Ingresa tu correo.',
  emailInvalid: 'Escribe un correo válido, p. ej. nombre@correo.com.',
  passwordRequired: 'Ingresa tu contraseña.',
  passwordTooShort: 'Usa al menos 8 caracteres.',
  confirmRequired: 'Repite la contraseña.',
  passwordMismatch: 'Las contraseñas no coinciden.',
  codeRequired: 'Ingresa el código que te enviamos.',
};

/** Resolve a zod message key from `@17suit/core` auth schemas to screen text. */
export function authErrorText(key: string | undefined): string | null {
  if (!key) return null;
  return AUTH_ERRORS[key as AuthErrorKey] ?? 'Revisa este campo.';
}
