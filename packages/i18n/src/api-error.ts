import type { TFunction } from 'i18next';

import { errors } from './catalogs/en/errors';
import { errors as esErrors } from './catalogs/es/errors';
import { DEFAULT_LOCALE, type Locale } from './locales';

/** Shape of `ApiError` from `@17suit/core` that the translation needs. */
export interface ApiErrorLike {
  /** Key of the `errors` catalog, from the server error contract. */
  errorKey?: string;
  params?: Record<string, string | number>;
  /** Client-side failure kind (`NETWORK_ERROR`, `TIMEOUT`, ...). */
  code?: string;
}

export type ErrorKey = keyof typeof errors;

function isErrorKey(value: unknown): value is ErrorKey {
  return typeof value === 'string' && Object.hasOwn(errors, value);
}

/**
 * Catalog key for an API failure: the server `errorKey` when the catalog has it,
 * `network` for unreachable/timeout, `unknown` otherwise (never the raw message).
 */
export function resolveErrorKey(error: ApiErrorLike | null | undefined): ErrorKey {
  if (isErrorKey(error?.errorKey)) return error.errorKey;
  if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT') return 'network';
  return 'unknown';
}

/** `t` from `useTranslation()` / `getFixedT()`. */
export type TranslateFn = TFunction;

/** User-facing text for an API failure, in the active language. */
export function translateApiError(t: TranslateFn, error: ApiErrorLike | null | undefined): string {
  const translate = t as unknown as (key: string, options?: object) => string;
  return translate(`errors:${resolveErrorKey(error)}`, { ...(error?.params ?? {}) });
}

const CATALOGS: Record<Locale, Record<ErrorKey, string>> = { en: errors, es: esErrors };

/**
 * Same text as `translateApiError`, without i18next: for code that has no
 * React context (server actions, query helpers, native alerts). Interpolates
 * `{{param}}` placeholders from the server `params`.
 */
export function describeApiError(
  error: ApiErrorLike | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const template = (CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE])[resolveErrorKey(error)];
  const params = error?.params ?? {};
  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}
