import { describe, expect, it } from 'vitest';
import {
  SITE_KEYS,
  vercelBranchAlias,
  SITE_ORIGINS,
  allowedRedirectOrigins,
  landingAuthUrl,
  siteOrigin,
} from './site-origins';

const prod = { NODE_ENV: 'production' } as const;

describe('siteOrigin', () => {
  it('returns canonical https origins in production without any env var', () => {
    expect(siteOrigin('landing', prod)).toBe('https://www.17suit.com');
    expect(siteOrigin('seven-rc', prod)).toBe('https://seven-rc.17suit.com');
  });

  it('never returns a vercel.app or localhost origin in production', () => {
    for (const key of SITE_KEYS) {
      expect(siteOrigin(key, prod)).toMatch(
        /^https:\/\/[a-z-]+\.17suit\.com$|^https:\/\/www\.17suit\.com$/,
      );
    }
  });

  it('uses localhost ports outside production', () => {
    expect(siteOrigin('seven-rc', { NODE_ENV: 'development' })).toBe('http://localhost:3007');
    expect(siteOrigin('landing', {})).toBe('http://localhost:3000');
  });

  it('treats a Vercel preview build as non-production', () => {
    const env = { NODE_ENV: 'production', VERCEL_ENV: 'preview' };
    expect(siteOrigin('seven-rc', env)).toBe(
      'https://17s-client-seven-rc-web-git-development-17-suit.vercel.app',
    );
    expect(
      siteOrigin('seven-rc', { ...env, NEXT_PUBLIC_SITE_ORIGIN_SEVEN_RC: 'https://x.vercel.app/' }),
    ).toBe('https://x.vercel.app');
  });
});

describe('landingAuthUrl', () => {
  it('builds auth urls on the landing origin', () => {
    expect(landingAuthUrl('sign-in', prod)).toBe('https://www.17suit.com/sign-in');
    expect(landingAuthUrl('sso-callback', { NODE_ENV: 'development' })).toBe(
      'http://localhost:3000/sso-callback',
    );
  });
});

describe('allowedRedirectOrigins', () => {
  it('includes every catalog site in production', () => {
    const origins = allowedRedirectOrigins(prod);
    for (const entry of Object.values(SITE_ORIGINS)) {
      expect(origins).toContain(`https://${entry.host}`);
    }
  });

  it('does not allow foreign or vercel.app origins by default', () => {
    const origins = allowedRedirectOrigins(prod);
    expect(origins).not.toContain('https://17s-client-seven-rc-web.vercel.app');
    expect(origins).not.toContain('https://evil.example.com');
  });

  it('adds valid extras from NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS and drops invalid ones', () => {
    const origins = allowedRedirectOrigins({
      ...prod,
      NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS: 'https://p.vercel.app/, not-a-url',
    });
    expect(origins).toContain('https://p.vercel.app');
    expect(origins).not.toContain('not-a-url');
  });
});

describe('preview origins', () => {
  const preview = { NODE_ENV: 'production', VERCEL_ENV: 'preview' };

  it('uses the branch alias of every project for the current branch', () => {
    const env = { ...preview, VERCEL_GIT_COMMIT_REF: 'deploy/auth-fix' };
    expect(siteOrigin('landing', env)).toBe(
      'https://17s-client-landing-git-deploy-auth-fix-17-suit.vercel.app',
    );
    expect(siteOrigin('seven-rc', env)).toBe(
      'https://17s-client-seven-rc-web-git-deploy-auth-fix-17-suit.vercel.app',
    );
  });

  it('falls back to the development alias when the branch alias would exceed 63 chars', () => {
    const env = { ...preview, VERCEL_GIT_COMMIT_REF: 'deploy/' + 'x'.repeat(40) };
    expect(
      vercelBranchAlias('17s-client-seven-rc-web', 'deploy/' + 'x'.repeat(40)),
    ).toBeUndefined();
    expect(siteOrigin('seven-rc', env)).toBe(
      'https://17s-client-seven-rc-web-git-development-17-suit.vercel.app',
    );
  });

  it('keeps localhost for sites without a Vercel project', () => {
    expect(siteOrigin('nine-cc', preview)).toBe('http://localhost:3009');
  });

  it('allow-lists the preview origins of the current branch plus production hosts', () => {
    const origins = allowedRedirectOrigins({ ...preview, VERCEL_GIT_COMMIT_REF: 'development' });
    expect(origins).toContain('https://17s-client-landing-git-development-17-suit.vercel.app');
    expect(origins).toContain('https://seven-rc.17suit.com');
    expect(origins).not.toContain('https://evil.vercel.app');
  });
});
