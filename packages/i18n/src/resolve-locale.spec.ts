import { describe, expect, it } from 'vitest';

import { normalizeLocale, parseAcceptLanguage } from './locales';
import { resolveLocale } from './resolve-locale';

describe('resolveLocale marketing', () => {
  it('uses the URL locale', () => {
    expect(resolveLocale({ profile: 'marketing', pathLocale: 'es' })).toBe('es');
  });
  it('unprefixed path is en', () => {
    expect(resolveLocale({ profile: 'marketing' })).toBe('en');
  });
  it('unknown segment falls back to en', () => {
    expect(resolveLocale({ profile: 'marketing', pathLocale: 'fr' })).toBe('en');
  });
  it('ignores saved and detected so static pages stay cache-safe', () => {
    expect(
      resolveLocale({ profile: 'marketing', saved: 'es', detected: ['es-MX'], pathLocale: null }),
    ).toBe('en');
  });
});

describe('resolveLocale product', () => {
  it('saved preference wins over device', () => {
    expect(resolveLocale({ profile: 'product', saved: 'en', detected: ['es-MX'] })).toBe('en');
  });
  it('uses first supported device tag', () => {
    expect(resolveLocale({ profile: 'product', detected: ['fr-FR', 'es-AR', 'en'] })).toBe('es');
  });
  it('invalid saved value is ignored', () => {
    expect(resolveLocale({ profile: 'product', saved: 'xx', detected: ['es'] })).toBe('es');
  });
  it('defaults to en when nothing matches', () => {
    expect(resolveLocale({ profile: 'product', detected: ['fr', 'de'] })).toBe('en');
    expect(resolveLocale({ profile: 'product' })).toBe('en');
  });
  it('does not use the URL locale', () => {
    expect(resolveLocale({ profile: 'product', pathLocale: 'es' })).toBe('en');
  });
});

describe('normalizeLocale', () => {
  it('maps regional and underscore tags', () => {
    expect(normalizeLocale('es-MX')).toBe('es');
    expect(normalizeLocale('EN_us')).toBe('en');
  });
  it('returns null for unsupported or empty', () => {
    expect(normalizeLocale('pt-BR')).toBeNull();
    expect(normalizeLocale('')).toBeNull();
    expect(normalizeLocale(undefined)).toBeNull();
  });
});

describe('parseAcceptLanguage', () => {
  it('orders by quality, stable on ties', () => {
    expect(parseAcceptLanguage('fr;q=0.5, es-MX, en;q=0.8')).toEqual(['es-MX', 'en', 'fr']);
  });
  it('drops q=0 and handles empty', () => {
    expect(parseAcceptLanguage('es;q=0, en')).toEqual(['en']);
    expect(parseAcceptLanguage(null)).toEqual([]);
  });
});
