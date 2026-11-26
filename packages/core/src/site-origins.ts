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
 * - Vercel preview (`VERCEL_ENV=preview`): the stable branch alias Vercel gives
 *   every project, `https://<vercelProject>-git-<branch>-<team>.vercel.app`,
 *   built from `VERCEL_GIT_COMMIT_REF`. Only branches that deploy
 *   (`development`, `deploy/*`) have one. Sites with no Vercel project yet
 *   fall back to localhost.
 * - anything else (local dev, tests): `http://localhost:<devPort>`.
 * - `NEXT_PUBLIC_SITE_ORIGIN_<KEY>` overrides all of the above (escape hatch).
 */

export type SiteKey = 'landing' | 'fifteen-ac' | 'seven-rc' | 'nine-cc' | 'admin';

export interface SiteOriginEntry {
  /** Canonical production host (no scheme). */
  host: string;
  /** Local dev port, used outside production. */
  devPort: number;
  /** Vercel project name; enables preview branch-alias origins. */
  vercelProject?: string;
}

/** Vercel team slug, part of every `*.vercel.app` alias. */
export const VERCEL_TEAM_SLUG = '17-suit';
/** Branch whose alias is used when the current branch has none or it is too long. */
export const PREVIEW_FALLBACK_BRANCH = 'development';
/** DNS label limit; Vercel hashes longer aliases, so they cannot be derived. */
const MAX_DNS_LABEL = 63;

export const SITE_ORIGINS: Readonly<Record<SiteKey, SiteOriginEntry>> = {
  landing: { host: 'www.17suit.com', devPort: 3000, vercelProject: '17s-client-landing' },
  'fifteen-ac': { host: 'fifteen-ac.17suit.com', devPort: 3015 },
  'seven-rc': {
    host: 'seven-rc.17suit.com',
    devPort: 3007,
    vercelProject: '17s-client-seven-rc-web',
  },
  'nine-cc': { host: 'nine-cc.17suit.com', devPort: 3009 },
  admin: { host: 'admin.17suit.com', devPort: 3018, vercelProject: '17s-client-admin' },
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

export function isPreviewEnv(env: SiteEnv = process.env): boolean {
  return env.VERCEL_ENV === 'preview';
}

function branchSlug(ref: string): string {
  return ref
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Stable Vercel alias of a project for a branch, or undefined if it cannot be derived. */
export function vercelBranchAlias(project: string, ref: string): string | undefined {
  const slug = branchSlug(ref);
  if (!slug) return undefined;
  const label = `${project}-git-${slug}-${VERCEL_TEAM_SLUG}`;
  return label.length > MAX_DNS_LABEL ? undefined : `https://${label}.vercel.app`;
}

function previewOrigin(entry: SiteOriginEntry, env: SiteEnv): string | undefined {
  if (!entry.vercelProject) return undefined;
  const ref = env.VERCEL_GIT_COMMIT_REF?.trim();
  return (
    (ref ? vercelBranchAlias(entry.vercelProject, ref) : undefined) ??
    vercelBranchAlias(entry.vercelProject, PREVIEW_FALLBACK_BRANCH)
  );
}

/** Origin (no trailing slash) of a site for the given environment. */
export function siteOrigin(key: SiteKey, env: SiteEnv = process.env): string {
  const override = readOverride(key, env);
  if (override) return override;
  const entry = SITE_ORIGINS[key];
  if (isProductionEnv(env)) return `https://${entry.host}`;
  if (isPreviewEnv(env)) {
    const preview = previewOrigin(entry, env);
    if (preview) return preview;
  }
  return `http://localhost:${entry.devPort}`;
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
 * The production host is always kept, so a canonical link still works from
 * local dev and previews.
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
