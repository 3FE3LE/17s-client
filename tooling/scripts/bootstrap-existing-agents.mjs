#!/usr/bin/env node
// Bootstrap stub `.claude/agents/<app>.md` files for every active app in
// 17s-client/apps-registry.json. Idempotent: skips files that already have
// content. Resolves paths from this file's location (co-located with the
// registry).

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_ROOT = join(__dirname, '..', '..');
const WORKSPACE_ROOT = join(CLIENT_ROOT, '..');
const REGISTRY_PATH = join(CLIENT_ROOT, 'apps-registry.json');
const AGENTS_DIR = join(WORKSPACE_ROOT, '.claude', 'agents');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function listRoutes(appDir) {
  const out = [];
  const appRoot = join(appDir, 'app');
  if (!existsSync(appRoot)) return out;
  const walk = (dir, prefix = '') => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = join(prefix, entry.name);
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), rel);
      } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
        out.push(`app/${rel}`);
      }
    }
  };
  walk(appRoot);
  return out.slice(0, 30);
}

function deriveConventions(pkg) {
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const stack = [];
  if (all['@clerk/nextjs'] || all['@clerk/clerk-expo']) stack.push('auth: @clerk/*');
  if (all['nuqs']) stack.push('URL state: nuqs');
  if (all['react-hook-form']) stack.push('forms: react-hook-form');
  if (all['zod']) stack.push('validation: zod');
  if (all['@tanstack/react-query']) stack.push('data: @tanstack/react-query');
  if (all['expo-router']) stack.push('routing: expo-router');
  if (all['next']) stack.push('routing: next app-router');
  if (all['@sentry/nextjs'] || all['@sentry/react-native']) stack.push('observability: @sentry/*');
  return stack.length
    ? stack.map((s) => `- ${s}`).join('\n')
    : '- <!-- TODO: capture local conventions -->';
}

function deriveTitle(slug) {
  return slug
    .split('-')
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(' ');
}

function renderAgent(slug, entry) {
  const rel = (entry.appDir || '').replace(/^17s-client\//, '');
  const pkgPath = join(CLIENT_ROOT, rel, 'package.json');
  if (!existsSync(pkgPath)) return null;
  const pkg = readJson(pkgPath);
  const title = deriveTitle(slug);
  const routes = listRoutes(entry.appDir);
  const routesBlock = routes.length
    ? routes.map((r) => `- \`${r}\``).join('\n')
    : '- <!-- TODO: enumerate top-level routes -->';
  const neighbors = entry.neighborApps?.length
    ? entry.neighborApps.map((n) => `- [${n}](${n}.md)`).join('\n')
    : '- (none)';
  const memoryAbs = join(
    '/home/fl/.claude/projects/-home-fl-17s-workspace/memory',
    entry.memoryFile,
  );

  return `# ${title}

> Auto-generated stub. Owner fills in TODO sections within first session working on this app.

## Identity

- slug: \`${slug}\`
- kind: \`${entry.kind}\`
- package: \`${entry.package}\`
- appDir: \`${entry.appDir}\`
- vercelProject: \`${entry.vercelProject}\`
- subdomain: \`${entry.subdomain}\`
- devPort: \`${entry.devPort}\`
- owner: \`${entry.owner}\`

## Domain Glossary

<!-- TODO: 5-15 bullets of business terms specific to this app -->
- (placeholder)

## Screen Map

${routesBlock}

## API Contracts

- Endpoint symbols live in \`17s-client/packages/core/src/api-schema.ts\`.
- Refresh via \`pnpm --filter @17suit/core gen:api-schema\` after server DTO changes.
- <!-- TODO: list endpoints this app actually calls, citing generated type names -->

## Invariants

<!-- TODO: non-negotiable behaviors. Things that must always hold. -->
- (placeholder)

## Conventions

${deriveConventions(pkg)}

## Do Not Touch

- \`proxy.ts\` — auth bridge; coordinate with auth-owner.
- \`vercel.mjs\` — Vercel project wiring.
- \`pnpm-lock.yaml\` — only via \`pnpm install\` in this app dir.
- \`packages/core/src/api-schema.ts\` — generated; regenerate, don't hand-edit.

## Related Context

- Fence file: \`${entry.fenceFile}\` (in-repo operating contract for this app).
- Memory: \`${memoryAbs}\` (project memory, non-derivable facts).
- Registry entry: \`apps-registry.json#apps.${slug}\`.
- Neighbor apps:
${neighbors}
`;
}

function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.error(`Registry not found: ${REGISTRY_PATH}`);
    process.exit(1);
  }
  const reg = readJson(REGISTRY_PATH);
  mkdirSync(AGENTS_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;
  for (const [slug, entry] of Object.entries(reg.apps || {})) {
    if (entry.active === false) continue;
    const out = join(AGENTS_DIR, `${slug}.md`);
    if (existsSync(out) && readFileSync(out, 'utf8').trim().length > 0) {
      skipped += 1;
      console.log(`skip   ${out}`);
      continue;
    }
    const content = renderAgent(slug, entry);
    if (!content) {
      console.log(`nolpkg  ${slug} (no package.json, skipping)`);
      continue;
    }
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, content, 'utf8');
    written += 1;
    console.log(`wrote  ${out}`);
  }
  console.log(`\nDone. written=${written} skipped=${skipped}`);
}

main();
