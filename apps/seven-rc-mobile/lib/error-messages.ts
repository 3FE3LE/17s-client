/**
 * Map raw SDK / network errors to human copy from the `mobile` catalog.
 *
 * HTTP failures arrive as `SevenRcApiError`, which carries `.status`; that is
 * mapped first. Everything else is a non-HTTP failure: a plain `Error` /
 * `TypeError` from fetch (offline, DNS), an `AbortError` from the timeout, or
 * the SDK's own `Error('Unauthorized')` when no token is available. Those fall
 * back to message heuristics.
 */

import { SevenRcApiError } from '@17suit/module-seven-reservations-club/client';
import type { MobileT } from './i18n';

type Context = 'load' | 'create' | 'cancel' | 'confirm' | 'reject' | 'save' | 'manage' | 'payment';

/** Catalog key for an error context under `errors.<group>.<context>`. */
const errorKey = (group: 'conflict' | 'badRequest' | 'fallback', context: Context) =>
  `errors.${group}.${context}`;

function statusFromMessage(message: string): number | null {
  const match = /\((\d{3})\)/.exec(message);
  return match ? Number(match[1]) : null;
}

function fromStatus(status: number, context: Context, t: MobileT): string | null {
  if (status === 401) return t('errors.session');
  if (status === 403) return t('errors.forbidden');
  if (status === 404) return t('errors.notFound');
  if (status === 409) return t(errorKey('conflict', context));
  if (status === 400 || status === 422) return t(errorKey('badRequest', context));
  if (status === 429) return t('errors.rate');
  if (status >= 500) return t('errors.server');
  return null;
}

/**
 * No HTTP response arrived (offline, DNS, timeout). Expo's fetch reports these
 * as "fetch failed: …". A status in the message always means the server
 * answered, even "Failed to fetch platform user (401)".
 */
export function isTransportError(error: unknown): boolean {
  if (error instanceof SevenRcApiError) return false;
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  if (statusFromMessage(message) !== null) return false;
  if (error instanceof Error && error.name === 'AbortError') return true;
  return /abort|network|failed to fetch|fetch failed|unable to reach|timeout|timed out/i.test(
    message,
  );
}

/** The server rejected the request, so sending it again cannot help (401, 403, other 4xx). */
export function isClientError(error: unknown): boolean {
  if (error instanceof SevenRcApiError) return error.status < 500;
  if (!(error instanceof Error)) return false;
  const status = statusFromMessage(error.message);
  if (status !== null) return status < 500;
  // The role data source surfaces the server's error name instead of the status.
  return /^(unauthorized|forbidden)$/i.test(error.message.trim());
}

export function humanizeError(error: unknown, t: MobileT, context: Context = 'load'): string {
  const fallback = t(errorKey('fallback', context));
  if (error instanceof SevenRcApiError) {
    return fromStatus(error.status, context, t) ?? fallback;
  }

  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : null;
  if (raw === null) return fallback;
  const message = raw.trim();
  const lower = message.toLowerCase();
  const status = statusFromMessage(message);

  if (isTransportError(error)) return t('errors.network');
  if (lower === 'unauthorized' || status === 401) return t('errors.session');
  if (lower === 'forbidden' || status === 403) return t('errors.forbidden');
  if (lower === 'not found' || status === 404) return t('errors.notFound');
  if (lower === 'conflict' || status === 409) return t(errorKey('conflict', context));
  if (
    lower === 'bad request' ||
    lower === 'unprocessable entity' ||
    status === 400 ||
    status === 422
  ) {
    return t(errorKey('badRequest', context));
  }
  if (lower === 'too many requests' || status === 429) return t('errors.rate');
  if (lower === 'internal server error' || (status !== null && status >= 500)) {
    return t('errors.server');
  }

  return fallback;
}

/** Clerk errors carry `errors[].code`; map the common ones to catalog keys. */
const CLERK_KEYS: Record<string, string> = {
  form_identifier_not_found: 'clerk.identifierNotFound',
  form_password_incorrect: 'clerk.passwordIncorrect',
  form_password_pwned: 'clerk.passwordPwned',
  form_password_length_too_short: 'clerk.passwordTooShort',
  form_password_validation_failed: 'clerk.passwordValidationFailed',
  form_identifier_exists: 'clerk.identifierExists',
  form_param_format_invalid: 'clerk.paramFormatInvalid',
  form_code_incorrect: 'clerk.codeIncorrect',
  verification_expired: 'clerk.verificationExpired',
  verification_failed: 'clerk.verificationFailed',
  session_exists: 'clerk.sessionExists',
  too_many_requests: 'errors.rate',
};

export function humanizeClerkError(error: unknown, fallback: string, t: MobileT): string {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const errors = (error as { errors?: Array<{ code?: string }> }).errors;
    const code = errors?.[0]?.code;
    const key = code ? CLERK_KEYS[code] : undefined;
    if (key) return t(key);
  }
  if (error instanceof Error && error.message.toLowerCase().includes('network')) {
    return t('errors.network');
  }
  return fallback;
}
