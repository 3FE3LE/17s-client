import { describe, expect, it } from 'vitest';

import { describeApiError, resolveErrorKey, translateApiError } from './api-error';
import { createI18n } from './create-i18n';

describe('resolveErrorKey', () => {
  it('uses the server key when the catalog has it', () => {
    expect(resolveErrorKey({ errorKey: 'notFound' })).toBe('notFound');
  });

  it('maps network failures and ignores unknown server keys', () => {
    expect(resolveErrorKey({ code: 'TIMEOUT' })).toBe('network');
    expect(resolveErrorKey({ errorKey: 'slotTakenInventedKey', code: 'HTTP_ERROR' })).toBe(
      'unknown',
    );
    expect(resolveErrorKey(null)).toBe('unknown');
  });
});

describe('translateApiError', () => {
  it('translates in the active locale and falls back to unknown', () => {
    const es = createI18n({ locale: 'es' });
    const en = createI18n({ locale: 'en' });
    expect(translateApiError(es.t, { errorKey: 'rateLimited' })).toBe(
      'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
    );
    expect(translateApiError(en.t, { errorKey: 'rateLimited' })).toBe(
      'Too many attempts. Wait a minute and try again.',
    );
    expect(translateApiError(en.t, {})).toBe('Something went wrong. Please try again.');
  });
});

describe('describeApiError', () => {
  it('interpolates server params in both locales', () => {
    const error = { errorKey: 'cancellationWindowPassed', params: { hours: 24 } };
    expect(describeApiError(error, 'es')).toContain('hasta 24 h antes');
    expect(describeApiError(error, 'en')).toContain('up to 24 h before');
  });

  it('keeps every server key of the 7RC error contract in both catalogs', () => {
    for (const key of ['slotUnavailable', 'blockOverlapsReservations', 'policyChanged']) {
      expect(resolveErrorKey({ errorKey: key })).toBe(key);
    }
  });

  it('falls back to the unknown text and never leaks a raw message', () => {
    expect(describeApiError({ errorKey: 'madeUp' }, 'es')).toBe(
      'Algo salió mal. Inténtalo de nuevo.',
    );
  });
});
