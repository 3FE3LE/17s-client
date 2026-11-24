import { describe, expect, it } from 'vitest';

import { resolveErrorKey, translateApiError } from './api-error';
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
