import { describeApiError, type ApiErrorLike, type Locale } from '@17suit/i18n';

import { notify as defaultNotify, type NotifyService } from './toast';

export interface RunActionOptions<T> {
  /** Shown only after `action` resolved. Never shown on failure. */
  success?: string | ((result: T) => string);
  /** Used when the error has no usable `errorKey`. Defaults to the catalog `unknown` text. */
  errorFallback?: string;
  /** Maps a failure to an `ApiErrorLike` (e.g. reads `errorKey` from an SDK error). */
  toApiError?: (error: unknown) => ApiErrorLike | undefined;
  locale?: Locale;
  /** Set to false to handle the failure yourself (inline form errors). */
  toastError?: boolean;
  /** Mobile passes its own surface; web uses the shared toast. */
  notify?: Pick<NotifyService, 'success' | 'error'>;
}

export type ActionResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: unknown; message: string };

/**
 * Runs an async operation and reports its real outcome: success text only after
 * it resolves, failure text translated from the server `errorKey`. Never throws.
 */
export async function runAction<T>(
  action: () => Promise<T>,
  options: RunActionOptions<T> = {},
): Promise<ActionResult<T>> {
  const notify = options.notify ?? defaultNotify;
  try {
    const value = await action();
    if (options.success) {
      notify.success(
        typeof options.success === 'function' ? options.success(value) : options.success,
      );
    }
    return { ok: true, value };
  } catch (error) {
    const apiError = options.toApiError?.(error) ?? (error as ApiErrorLike | undefined);
    const known = apiError?.errorKey || apiError?.code;
    const message =
      !known && options.errorFallback
        ? options.errorFallback
        : describeApiError(apiError, options.locale);
    if (options.toastError !== false) notify.error(message);
    return { ok: false, error, message };
  }
}
