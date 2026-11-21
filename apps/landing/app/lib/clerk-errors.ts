/**
 * Clerk error helpers shared by sign-in, sign-up and forgot-password.
 *
 * Users never see raw Clerk codes or English messages: known codes map to
 * Spanish copy that names the problem and the way forward, and anything else
 * falls back to the caller's generic Spanish message.
 */

export interface ClerkApiError {
  code?: string;
  message?: string;
  longMessage?: string;
}

export function getClerkErrors(error: unknown): ClerkApiError[] {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    return (error as { errors?: ClerkApiError[] }).errors ?? [];
  }
  return [];
}

// Clerk rejects auth attempts when a session is already active (single-session).
// Callers treat that as "continue to the product".
export function isAlreadySignedInError(error: unknown): boolean {
  return getClerkErrors(error).some(
    (e) =>
      e.code === 'session_exists' ||
      e.code === 'identifier_already_signed_in' ||
      (e.message ?? '').toLowerCase().includes('already signed in'),
  );
}

// Messages that send the user to /contacto. AuthFormError renders a link next to them.
const CONTACT_ACCESS_MESSAGE =
  'Este correo no tiene acceso. Usa otro o escríbenos desde la página de contacto.';

const contactMessages: ReadonlySet<string> = new Set([CONTACT_ACCESS_MESSAGE]);

export function needsContactLink(message: string): boolean {
  return contactMessages.has(message);
}

const messagesByCode: Record<string, string> = {
  form_identifier_not_found:
    'No encontramos una cuenta con ese correo. Revísalo o crea una cuenta.',
  form_password_incorrect: 'La contraseña no es correcta. Inténtalo de nuevo o restablécela.',
  form_identifier_exists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
  form_param_format_invalid: 'Revisa el formato del correo electrónico.',
  form_param_nil: 'Completa todos los campos.',
  form_password_length_too_short: 'La contraseña es muy corta. Elige una más larga.',
  form_password_pwned: 'Esa contraseña apareció en una filtración de datos. Elige una distinta.',
  form_password_not_strong_enough: 'La contraseña es muy débil. Combina más caracteres.',
  form_password_validation_failed: 'La contraseña no cumple los requisitos. Elige otra.',
  form_code_incorrect: 'El código no es correcto. Revisa tu correo e inténtalo de nuevo.',
  verification_expired: 'El código venció. Solicita uno nuevo.',
  verification_failed: 'No pudimos verificar el código. Solicita uno nuevo.',
  strategy_for_user_invalid:
    'Esta cuenta no usa contraseña. Entra con Google o restablece tu contraseña.',
  user_locked:
    'Tu cuenta está bloqueada temporalmente por varios intentos fallidos. Espera unos minutos.',
  too_many_requests: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
  rate_limit_exceeded: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
  captcha_invalid:
    'No pudimos validar que eres una persona. Recarga la página e inténtalo de nuevo.',
  not_allowed_access: CONTACT_ACCESS_MESSAGE,
};

export function getClerkErrorMessage(error: unknown, fallback: string): string {
  const code = getClerkErrors(error)[0]?.code;
  return (code && messagesByCode[code]) || fallback;
}
