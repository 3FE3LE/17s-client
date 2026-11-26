import { describe, expect, it } from 'vitest';

import { createI18n } from './create-i18n';

describe('createI18n', () => {
  it('translates shared catalogs per locale', () => {
    expect(createI18n({ locale: 'es' }).t('theme.dark')).toBe('Oscuro');
    expect(createI18n({ locale: 'en' }).t('theme.dark')).toBe('Dark');
  });
  it('merges product namespaces and falls back to en', () => {
    const i18n = createI18n({
      locale: 'es',
      resources: { en: { demo: { hello: 'Hello' } }, es: {} },
    });
    expect(i18n.t('hello', { ns: 'demo' })).toBe('Hello');
  });
  it('instances are isolated', () => {
    const a = createI18n({ locale: 'en' });
    const b = createI18n({ locale: 'es' });
    expect(a.language).toBe('en');
    expect(b.language).toBe('es');
  });
});
