import { describe, expect, it } from 'vitest';
import { localePath, stripLocale } from './locale-path';

describe('localePath', () => {
  it('leaves en unprefixed', () => {
    expect(localePath('en', '/')).toBe('/');
    expect(localePath('en', '/contact')).toBe('/contact');
  });

  it('prefixes other locales', () => {
    expect(localePath('es', '/')).toBe('/es');
    expect(localePath('es', '/contact')).toBe('/es/contact');
  });
});

describe('stripLocale', () => {
  it('removes a locale segment', () => {
    expect(stripLocale('/es', ['en', 'es'])).toBe('/');
    expect(stripLocale('/es/contact', ['en', 'es'])).toBe('/contact');
  });

  it('keeps paths without one', () => {
    expect(stripLocale('/contact', ['en', 'es'])).toBe('/contact');
    expect(stripLocale('/', ['en', 'es'])).toBe('/');
  });
});
