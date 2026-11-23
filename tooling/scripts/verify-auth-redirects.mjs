#!/usr/bin/env node
/**
 * Verify every active web product app carries the four auth-bridge redirect
 * stubs. Each stub is a thin server component that 307-redirects to the
 * landing origin (which hosts the actual Clerk UI), preserving `redirect_url`.
 *
 * Fails (exit 1) if any web app in `apps-registry.json` is missing one or
 * more of the four files, or if any file does not:
 *   - import `redirect` from `next/navigation`
 *   - call `redirect(...)` with a landing-origin URL
 *
 * Run from `17s-client` (cwd must contain `apps/` and the registry lives at
 * `../apps-registry.json`).
 *
 * Used by:
 *   - manual `pnpm tooling:verify-auth-redirects`
 *   - CI gates after a scaffold run (post-new-app check)
 *
 * Companion to `tooling/scripts/check-registry.mjs` — that script verifies
 * registry integrity, this one verifies the auth-bridge duplication contract.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_ROOT = join(__dirname, '..', '..');
const WORKSPACE_ROOT = join(CLIENT_ROOT, '..');
const REGISTRY_PATH = join(WORKSPACE_ROOT, 'apps-registry.json');

const REQUIRED_STUBS = [
  'app/sign-in/[[...sign-in]]/page.tsx',
  'app/sign-up/[[...sign-up]]/page.tsx',
  'app/forgot-password/page.tsx',
  'app/sso-callback/[[...sso-callback]]/page.tsx',
];

const REQUIRED_IMPORT = /from ['"]next\/navigation['"]/;
const REQUIRED_REDIRECT_CALL = /\bredirect\s*\(/;
const LANDING_HINT_RE = /localhost:3000|17suit\.com|NEXT_PUBLIC_CLERK_SIGN_(IN|UP)_URL/;

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

if (!existsSync(REGISTRY_PATH)) {
  die(`REGISTRY_MISSING: ${REGISTRY_PATH}`);
}

let registry;
try {
  registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
} catch (err) {
  die(`REGISTRY_PARSE_ERROR: ${err.message}`);
}

const apps = Object.entries(registry.apps ?? {});
const webApps = apps
  .filter(([, entry]) => entry.kind === 'web' && entry.active && entry.appDir)
  .map(([slug, entry]) => ({ slug, entry }));

if (webApps.length === 0) {
  console.log('verify-auth-redirects: no active web apps in registry; nothing to check.');
  process.exit(0);
}

const failures = [];

for (const { slug, entry } of webApps) {
  const appDirAbs = join(WORKSPACE_ROOT, entry.appDir);
  const fileFailures = [];

  for (const rel of REQUIRED_STUBS) {
    const filePath = join(appDirAbs, rel);
    if (!existsSync(filePath)) {
      fileFailures.push(`missing ${rel}`);
      continue;
    }
    const content = readFileSync(filePath, 'utf8');
    if (!REQUIRED_IMPORT.test(content)) {
      fileFailures.push(`${rel}: must import { redirect } from 'next/navigation'`);
      continue;
    }
    if (!REQUIRED_REDIRECT_CALL.test(content)) {
      fileFailures.push(`${rel}: must call redirect(...)`);
      continue;
    }
    if (!LANDING_HINT_RE.test(content)) {
      fileFailures.push(
        `${rel}: must reference a landing-origin URL (NEXT_PUBLIC_CLERK_SIGN_IN_URL or NEXT_PUBLIC_CLERK_SIGN_UP_URL or localhost:3000 or *.17suit.com)`,
      );
    }
  }

  if (fileFailures.length === 0) {
    console.log(`PASS  ${slug}  (${entry.appDir}) — all 4 auth-bridge stubs present and redirect to landing.`);
  } else {
    failures.push({ slug, appDir: entry.appDir, fileFailures });
    console.log(`FAIL  ${slug}  (${entry.appDir})`);
    for (const f of fileFailures) console.log(`        - ${f}`);
  }
}

if (failures.length > 0) {
  console.error(`\nverify-auth-redirects: ${failures.length} app(s) failed auth-bridge contract.`);
  console.error(
    'Fix: copy the stub files from apps/seven-rc-web/app/{sign-in,sign-up,forgot-password,sso-callback}/* — they are token-free and identical across product apps.',
  );
  process.exit(1);
}

console.log(`\nverify-auth-redirects: ${webApps.length} active web app(s) checked, all green.`);
