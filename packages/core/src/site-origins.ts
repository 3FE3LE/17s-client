/**
 * Single source of truth for every public origin of the 17 Suit family.
 *
 * Auth redirects, the redirect allow-list and cross-app links all derive from
 * this catalog, so adding a product is one entry here and no per-project
 * Vercel variable. Mirrors `apps-registry.json` (workspace root); the registry
 * stays the source for tooling, this file is the one the apps import.
 *
 * Environment rules (`SiteEnv`):
 * - `production`: canonical `https://<host>` origins.
 * - anything else (local dev, tests): `http://localhost:<devPort>`.
 * - Preview deployments have unpredictable hosts, so they use the optional
 *   `NEXT_PUBLIC_SITE_ORIGIN_<KEY>` override (e.g. `..._SEVEN_RC`).
 */

export type SiteKey = 'landing' | 'fifteen-ac' | 'seven-rc' | 'nine-cc' | 'admin';

export interface SiteOriginEntry {
  /** Canonical production host (no scheme). */
  host: string;
  /** Local dev port, used outside production. */
  devPort: number;
}

export const SITE_ORIGINS: Readonly<Record<SiteKey, SiteOriginEntry>> = {
  landing: { host: 'www.17suit.com', devPort: 3000 },
  'fifteen-ac': { host: 'fifteen-ac.17suit.com', devPort: 3015 },
  'seven-rc': { host: 'seven-rc.17suit.com', devPort: 3007 },
  'nine-cc': { host: 'nine-cc.17suit.com', devPort: 3009 },
  admin: { host: 'admin.17suit.com', devPort: 3018 },
};

export const SITE_KEYS = Object.keys(SITE_ORIGINS) as SiteKey[];

export type SiteEnv = Readonly<Record<string, string | undefined>>;

export function isProductionEnv(env: SiteEnv = process.env): boolean {
  return env.NODE_ENV === 'production' && env.VERCEL_ENV !== 'preview';
}

// NEXT_PUBLIC_* must be read literally to be inlined at build time.
function readOverride(key: SiteKey, env: SiteEnv): string | undefined {
  const suffix = key.toUpperCase().replace(/-/g, '_');
  const value = env[`NEXT_PUBLIC_SITE_ORIGIN_${suffix}`]?.trim();
  return value ? normalizeOrigin(value) : undefined;
}

export function normalizeOrigin(value: string): string | undefined {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

/** Origin (no trailing slash) of a site for the given environment. */
export function siteOrigin(key: SiteKey, env: SiteEnv = process.env): string {
  const override = readOverride(key, env);
  if (override) return override;
  const entry = SITE_ORIGINS[key];
  return isProductionEnv(env) ? `https://${entry.host}` : `http://localhost:${entry.devPort}`;
}

/** Landing auth page URL, e.g. `https://www.17suit.com/sign-in`. */
export function landingAuthUrl(
  page: 'sign-in' | 'sign-up' | 'sso-callback' | 'forgot-password',
  env: SiteEnv = process.env,
): string {
  return `${siteOrigin('landing', env)}/${page}`;
}

/**
 * Origins an auth `redirect_url` may point to. Every catalog site, plus the
 * optional comma list in `NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS` (previews).
 * Outside production, each site resolves to localhost, so the production host
 * is also kept: a local app can still be reached from a canonical link.
 */
export function allowedRedirectOrigins(env: SiteEnv = process.env): string[] {
  const origins = new Set<string>();
  for (const key of SITE_KEYS) {
    origins.add(siteOrigin(key, env));
    origins.add(`https://${SITE_ORIGINS[key].host}`);
  }
  for (const extra of env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS?.split(',') ?? []) {
    const origin = normalizeOrigin(extra.trim());
    if (origin) origins.add(origin);
  }
  return [...origins];
}
