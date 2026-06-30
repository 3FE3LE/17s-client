import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resolveRedirectTarget } from './auth-redirect';

describe('resolveRedirectTarget', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL;
    delete process.env.NEXT_PUBLIC_SEVEN_RC_WEB_URL;
    delete process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('relative paths', () => {
    it('accepts a single-slash relative path', () => {
      expect(resolveRedirectTarget('/dashboard')).toBe('/dashboard');
    });

    it('rejects protocol-relative URLs (//evil.com) by treating them as relative', () => {
      // Spec rule: must NOT start with `//`. Implementation treats it as
      // "not allowed origin" → falls back to `/`.
      expect(resolveRedirectTarget('//evil.com/path')).toBe('/');
    });

    it('falls back to / when the value is empty or whitespace', () => {
      expect(resolveRedirectTarget('')).toBe('/');
      expect(resolveRedirectTarget('   ')).toBe('/');
      expect(resolveRedirectTarget(null)).toBe('/');
      expect(resolveRedirectTarget(undefined)).toBe('/');
    });

    it('takes the first value when an array is provided', () => {
      expect(resolveRedirectTarget(['/home', '/admin'])).toBe('/home');
    });
  });

  describe('allowed origins', () => {
    it('accepts an absolute URL matching NEXT_PUBLIC_FIFTEEN_AC_WEB_URL', () => {
      process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL = 'https://15ac.example.com';
      expect(resolveRedirectTarget('https://15ac.example.com/inbox')).toBe(
        'https://15ac.example.com/inbox',
      );
    });

    it('accepts an origin listed in NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS (comma list)', () => {
      process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS =
        'https://a.example.com,https://b.example.com';
      expect(resolveRedirectTarget('https://b.example.com/x')).toBe('https://b.example.com/x');
    });

    it('strips trailing slashes from configured origins before comparing', () => {
      process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL = 'https://15ac.example.com/';
      expect(resolveRedirectTarget('https://15ac.example.com/inbox')).toBe(
        'https://15ac.example.com/inbox',
      );
    });

    it('rejects an absolute URL whose origin is not allow-listed', () => {
      process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL = 'https://15ac.example.com';
      expect(resolveRedirectTarget('https://evil.example.com/x')).toBe('/');
    });
  });

  describe('localhost behavior', () => {
    it('allows localhost in development', () => {
      process.env.NODE_ENV = 'development';
      expect(resolveRedirectTarget('http://localhost:5173/app')).toBe('http://localhost:5173/app');
      expect(resolveRedirectTarget('http://127.0.0.1:3000/x')).toBe('http://127.0.0.1:3000/x');
    });

    it('rejects localhost in production even when other origins are configured', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL = 'https://15ac.example.com';
      expect(resolveRedirectTarget('http://localhost:3000/app')).toBe('/');
    });
  });

  describe('malformed input', () => {
    it('falls back to / for non-URL strings that are not relative paths', () => {
      expect(resolveRedirectTarget('not a url')).toBe('/');
    });
  });
});
