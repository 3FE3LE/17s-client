/**
 * Clerk error helpers shared by sign-in, sign-up and forgot-password.
 *
 * Users never see raw Clerk codes or messages: known codes map to catalog copy
 * (`account.errors.*`, per locale) that names the problem and the way forward,
 * and anything else falls back to the caller's generic message.
 */

export interface ClerkApiError {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: { paramName?: string };
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

/** Translator shape shared with react-i18next's `t`. */
export type Translate = (key: string) => string;

/** Codes whose message sends the user to /contact. AuthFormError renders a link next to them. */
const CONTACT_CODES: ReadonlySet<string> = new Set(['not_allowed_access']);

export function needsContactLink(message: string, t: Translate): boolean {
  return [...CONTACT_CODES].some((code) => message === t(`account.errors.${code}`));
}

const KNOWN_CODES: ReadonlySet<string> = new Set([
  'form_identifier_not_found',
  'form_password_incorrect',
  'form_identifier_exists',
  'form_param_format_invalid',
  'form_param_nil',
  'form_password_length_too_short',
  'form_password_pwned',
  'form_password_not_strong_enough',
  'form_password_validation_failed',
  'form_code_incorrect',
  'verification_expired',
  'verification_failed',
  'strategy_for_user_invalid',
  'user_locked',
  'too_many_requests',
  'rate_limit_exceeded',
  'captcha_invalid',
  'not_allowed_access',
]);

export function getClerkErrorMessage(error: unknown, fallback: string, t: Translate): string {
  const code = getClerkErrors(error)[0]?.code;
  return code && KNOWN_CODES.has(code) ? t(`account.errors.${code}`) : fallback;
}

/** Which field an error belongs to, so only that input gets `aria-invalid`. */
export type AuthErrorField = 'email' | 'password' | 'code' | null;

const fieldByCode: Record<string, AuthErrorField> = {
  form_identifier_not_found: 'email',
  form_identifier_exists: 'email',
  form_param_format_invalid: 'email',
  not_allowed_access: 'email',
  form_password_incorrect: 'password',
  form_password_length_too_short: 'password',
  form_password_pwned: 'password',
  form_password_not_strong_enough: 'password',
  form_password_validation_failed: 'password',
  form_code_incorrect: 'code',
  verification_expired: 'code',
  verification_failed: 'code',
};

const fieldByParam: Record<string, AuthErrorField> = {
  identifier: 'email',
  email_address: 'email',
  password: 'password',
  code: 'code',
};

export function getClerkErrorField(error: unknown): AuthErrorField {
  const first = getClerkErrors(error)[0];
  if (!first) return null;
  const byCode = first.code ? fieldByCode[first.code] : undefined;
  if (byCode) return byCode;
  const param = first.meta?.paramName;
  return (param && fieldByParam[param]) || null;
}
