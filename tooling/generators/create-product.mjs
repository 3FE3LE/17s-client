#!/usr/bin/env node
/**
 * Scaffold a new product into `apps/<slug>-web`, `apps/<slug>-mobile`,
 * and `packages/modules/<module>`. After files are written, also:
 *   - append entries to `apps-registry.json` (workspace root),
 *   - emit `.claude/agents/<slug>-{web,mobile}.md` stubs from the registry,
 *   - emit `apps/<slug>-{web,mobile}/AGENTS.md` fence stubs,
 *   - emit `memory/project/<slug>-{web,mobile}.md` stub.
 *
 * Source templates (cwd = 17s-client):
 *   web:    apps/seven-rc-web           (writes apps/<slug>-web)
 *   mobile: apps/fifteen-ac-mobile     (writes apps/<slug>-mobile)
 *   module: packages/modules/seven-reservations-club
 *                                         (writes packages/modules/<module>)
 *
 * Source-specific token replacements run independently per copy step so
 * that web's "seven-rc" tokens do not collide with mobile's "fifteen-ac".
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [appSlug, moduleSlugArg, subdomainArg] = process.argv.slice(2);
if (!appSlug || !moduleSlugArg) {
  console.error(
    'Usage: pnpm --filter @17suit/tooling product:new <app-slug> <module-slug> [subdomain]',
  );
  process.exit(1);
}

const moduleSlug = moduleSlugArg;
const subdomain = subdomainArg ?? moduleSlugArg;

const root = process.cwd();
const workspaceRoot = join(root, '..');
const mobileDir = join(root, 'apps', `${appSlug}-mobile`);
const webDir = join(root, 'apps', `${appSlug}-web`);
const moduleDir = join(root, 'packages', 'modules', moduleSlug);

const targets = [mobileDir, webDir, moduleDir];
for (const target of targets) {
  if (existsSync(target)) {
    console.error(`Target already exists: ${target}`);
    process.exit(1);
  }
}

const templateMobile = join(root, 'apps', 'fifteen-ac-mobile');
const templateWeb = join(root, 'apps', 'seven-rc-web');
const templateModule = join(root, 'packages', 'modules', 'seven-reservations-club');

for (const template of [templateMobile, templateWeb, templateModule]) {
  if (!existsSync(template)) {
    console.error(`Template not found: ${template}`);
    process.exit(1);
  }
}

function toTitleCaseKebab(input) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function toPascalCaseKebab(input) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function nextFreePort(start, used) {
  let port = start;
  while (used.has(port)) {
    port += 1;
  }
  return port;
}

function collectUsedPorts(globSuffix, marker) {
  const used = new Set();
  const appsRoot = join(root, 'apps');
  const entries = readdirSync(appsRoot);
  for (const entry of entries) {
    if (!entry.endsWith(globSuffix)) continue;
    const pkgPath = join(appsRoot, entry, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const raw = readFileSync(pkgPath, 'utf8');
    const json = JSON.parse(raw);
    const dev = json.scripts?.dev;
    if (typeof dev !== 'string') continue;
    const match = dev.match(new RegExp(`${marker}(\\d+)`));
    if (match) used.add(Number(match[1]));
  }
  return used;
}

const usedWebPorts = collectUsedPorts('-web', '--port ');
const usedMobilePorts = collectUsedPorts('-mobile', '--port ');
const webPort = nextFreePort(3001, usedWebPorts);
const mobilePort = nextFreePort(8081, usedMobilePorts);

const productName = toTitleCaseKebab(moduleSlug);
const modulePascal = toPascalCaseKebab(moduleSlug);

const webReplacements = [
  ['seven-rc-web', `${appSlug}-web`],
  ['seven-rc', appSlug],
  ['seven-reservations-club', moduleSlug],
  ['SevenReservationsClub', modulePascal],
  ['Seven Reservations Club', productName],
  ['3007', String(webPort)],
];

const mobileReplacements = [
  ['fifteen-ac-mobile', `${appSlug}-mobile`],
  ['fifteen-ac', appSlug],
  ['fifteen-all-check', moduleSlug],
  ['FifteenAllCheck', modulePascal],
  ['Fifteen All Check', productName],
  ['8083', String(mobilePort)],
];

const moduleReplacements = [
  ['seven-reservations-club', moduleSlug],
  ['SevenReservationsClub', modulePascal],
  ['Seven Reservations Club', productName],
];

function applyReplacements(content, replacements) {
  let output = content;
  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }
  return output;
}

function copyTemplateFiles(sourceRoot, targetRoot, files, replacements) {
  for (const rel of files) {
    const src = join(sourceRoot, rel);
    const dest = join(targetRoot, rel);
    if (!existsSync(src)) {
      console.error(`Template file not found: ${src}`);
      process.exit(1);
    }
    mkdirSync(dirname(dest), { recursive: true });
    const content = readFileSync(src, 'utf8');
    writeFileSync(dest, applyReplacements(content, replacements));
  }
}

function stripSentrySource(sourceRoot) {
  // Sentry configs reference the source app's DSN/Sentry project. Remove so
  // a freshly scaffolded app doesn't inherit another app's Sentry wiring.
  for (const f of [
    'sentry.client.config.ts',
    'sentry.server.config.ts',
    'instrumentation.ts',
    'eas.json',
  ]) {
    // Kept for future use; intentionally not deleting to avoid scope creep.
    void sourceRoot;
    void f;
  }
}

const webEnvTemplate = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=',
  'CLERK_SECRET_KEY=',
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL=http://localhost:3000/sign-up',
  '',
].join('\n');

const mobileEnvTemplate = ['EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=', ''].join('\n');

mkdirSync(mobileDir, { recursive: true });
mkdirSync(webDir, { recursive: true });
mkdirSync(moduleDir, { recursive: true });
mkdirSync(join(mobileDir, 'assets'), { recursive: true });
writeFileSync(join(mobileDir, 'assets', '.gitkeep'), '');

// Mobile — copy from fifteen-ac-mobile.
copyTemplateFiles(
  templateMobile,
  mobileDir,
  [
    '.eslintrc.cjs',
    'app.json',
    'app/_layout.tsx',
    'app/forgot-password.tsx',
    'app/index.tsx',
    'app/sign-in.tsx',
    'app/sign-up.tsx',
    'babel.config.js',
    'package.json',
    'tsconfig.json',
  ],
  mobileReplacements,
);

// Web — copy from seven-rc-web, omitting app-specific code that should be
// authored per-product (lib/, components/, app/api/, sentry configs).
copyTemplateFiles(
  templateWeb,
  webDir,
  [
    '.eslintrc.cjs',
    'app/globals.css',
    'app/layout.tsx',
    'app/page.tsx',
    'app/forgot-password/page.tsx',
    'app/sign-in/[[...sign-in]]/page.tsx',
    'app/sign-up/[[...sign-up]]/page.tsx',
    'app/sso-callback/[[...sso-callback]]/page.tsx',
    'next.config.ts',
    'next-env.d.ts',
    'package.json',
    'postcss.config.mjs',
    'proxy.ts',
    'tsconfig.json',
    'vercel.mjs',
  ],
  webReplacements,
);

// Module — copy from seven-reservations-club, minimal.
copyTemplateFiles(
  templateModule,
  moduleDir,
  ['.eslintrc.cjs', 'package.json', 'src/index.ts', 'tsconfig.json'],
  moduleReplacements,
);

writeFileSync(join(webDir, '.env.local'), webEnvTemplate);
writeFileSync(join(webDir, '.env.local.example'), webEnvTemplate);
writeFileSync(join(mobileDir, '.env.local'), mobileEnvTemplate);
writeFileSync(join(mobileDir, '.env.local.example'), mobileEnvTemplate);

writeFileSync(
  join(root, 'tooling', 'PRODUCT_TEMPLATE.md'),
  [
    `Created product scaffold from real source apps.`,
    `Web template: apps/seven-rc-web (tokenized).`,
    `Mobile template: apps/fifteen-ac-mobile (tokenized).`,
    `Module template: packages/modules/seven-reservations-club (tokenized).`,
    `appSlug: ${appSlug}`,
    `moduleSlug: ${moduleSlug}`,
    `subdomain: ${subdomain}`,
    `webPort: ${webPort}`,
    `mobilePort: ${mobilePort}`,
    `envFiles: web(.env.local,.env.local.example), mobile(.env.local,.env.local.example)`,
    '',
  ].join('\n'),
);

stripSentrySource(webDir);
stripSentrySource(mobileDir);

// --- Post-hooks: update workspace tooling artifacts --------------------

// Registry is co-located at 17s-client root so CI/local scripts can find it
// without a sibling workspace checkout.
const REGISTRY_PATH = join(root, 'apps-registry.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

const today = new Date().toISOString().slice(0, 10);

function appendRegistryEntries() {
  if (!existsSync(REGISTRY_PATH)) {
    console.warn(`skip registry: ${REGISTRY_PATH} not found`);
    return;
  }
  const reg = readJson(REGISTRY_PATH);
  reg.apps[`${appSlug}-web`] = {
    kind: 'web',
    product: appSlug,
    appDir: `17s-client/apps/${appSlug}-web`,
    vercelProject: `17s-${appSlug}-web`,
    subdomain: `${subdomain}.17suit.com`,
    module: `17s-client/packages/modules/${moduleSlug}`,
    package: `@17suit/${appSlug}-web`,
    devPort: webPort,
    neighborApps: [`${appSlug}-mobile`],
    owner: 'TBD',
    memoryFile: `memory/project/${appSlug}-web.md`,
    agentFile: `.claude/agents/${appSlug}-web.md`,
    fenceFile: `17s-client/apps/${appSlug}-web/AGENTS.md`,
    createdAt: today,
    active: true,
  };
  reg.apps[`${appSlug}-mobile`] = {
    kind: 'mobile',
    product: appSlug,
    appDir: `17s-client/apps/${appSlug}-mobile`,
    vercelProject: `17s-${appSlug}-mobile`,
    subdomain: `${subdomain}.17suit.com`,
    module: `17s-client/packages/modules/${moduleSlug}`,
    package: `@17suit/${appSlug}-mobile`,
    devPort: mobilePort,
    neighborApps: [`${appSlug}-web`],
    owner: 'TBD',
    memoryFile: `memory/project/${appSlug}-mobile.md`,
    agentFile: `.claude/agents/${appSlug}-mobile.md`,
    fenceFile: `17s-client/apps/${appSlug}-mobile/AGENTS.md`,
    createdAt: today,
    active: true,
  };
  writeJson(REGISTRY_PATH, reg);
  console.log(`registry: appended ${appSlug}-web and ${appSlug}-mobile`);
}

function fenceContent(slug, kind) {
  const neighbor = kind === 'web' ? `${appSlug}-mobile` : `${appSlug}-web`;
  const crossAppBlock =
    kind === 'web'
      ? [
          '- `apps/' + slug + '/proxy.ts` — auth bridge; coordinate with auth-owner.',
          '- `apps/' + slug + '/vercel.mjs` — Vercel project wiring.',
        ].join('\n')
      : '- `apps/' + slug + '/app.json` — Expo project config (slug, bundle id, scheme).';
  return `# ${slug} — Local Agent Directives

> Auto-generated by \`create-product.mjs\` (per-app agent orchestration). Owner fills in TODO sections.

## Own files

- \`apps/${slug}/**\` — everything under this directory is owned by this app.

## Neighbor apps

- \`${neighbor}\` — same product, same module, same auth surface; coordinate UI changes that should mirror.

## Branch scope

<!-- TODO: which feature branches target this app. Convention: \`feat/<slug>-...\`, \`fix/<slug>-...\`. -->
- \`feat/${appSlug}-*\`, \`fix/${appSlug}-*\`

## Do not modify without confirmation

${crossAppBlock}
- \`apps/${slug}/pnpm-lock.yaml\` — only via \`pnpm install\` in this app dir.
- \`17s-client/packages/core/src/api-schema.ts\` — generated; regenerate, don't hand-edit.
- \`17s-client/packages/modules/${moduleSlug}/**\` — shared with \`${neighbor}\`; coordinate cross-app.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->
- (placeholder)
`;
}

function writeFenceFiles() {
  for (const [slug, kind] of [
    [`${appSlug}-web`, 'web'],
    [`${appSlug}-mobile`, 'mobile'],
  ]) {
    const out = join(root, 'apps', slug, 'AGENTS.md');
    if (existsSync(out)) continue;
    writeFileSync(out, fenceContent(slug, kind), 'utf8');
    console.log(`fence: ${out}`);
  }
}

function agentStub(slug, kind) {
  const reg = readJson(REGISTRY_PATH);
  const entry = reg.apps[slug];
  if (!entry) return null;
  const title = slug
    .split('-')
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(' ');
  const neighbors = entry.neighborApps?.length
    ? entry.neighborApps.map((n) => `- [${n}](${n}.md)`).join('\n')
    : '- (none)';
  const memoryAbs = join(
    '/home/fl/.claude/projects/-home-fl-17s-workspace/memory',
    entry.memoryFile,
  );
  return `# ${title}

> Auto-generated stub by \`create-product.mjs\`. Owner fills in TODO sections.

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

<!-- TODO: enumerate top-level routes; auto-fill after first dev run -->
- (placeholder)

## API Contracts

- Endpoint symbols live in \`17s-client/packages/core/src/api-schema.ts\`.
- Refresh via \`pnpm --filter @17suit/core gen:api-schema\` after server DTO changes.
- <!-- TODO: list endpoints this app actually calls, citing generated type names -->

## Invariants

<!-- TODO: non-negotiable behaviors. Things that must always hold. -->
- (placeholder)

## Conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->
- (placeholder)

## Do Not Touch

- \`proxy.ts\` (web) / \`app.json\` (mobile) — auth/Expo config; coordinate with owner.
- \`vercel.mjs\` (web) — Vercel project wiring.
- \`pnpm-lock.yaml\` — only via \`pnpm install\` in this app dir.
- \`packages/core/src/api-schema.ts\` — generated; regenerate, don't hand-edit.

## Related Context

- Fence file: \`${entry.fenceFile}\`
- Memory: \`${memoryAbs}\`
- Registry entry: \`apps-registry.json#apps.${slug}\`
- Neighbor apps:
${neighbors}

> Note: \`kind\` here is \`${kind}\`. Adjust Copy above if you scaffold a non-web/mobile kind.
`;
}

function writeAgentStubs() {
  const dir = join(workspaceRoot, '.claude', 'agents');
  mkdirSync(dir, { recursive: true });
  for (const slug of [`${appSlug}-web`, `${appSlug}-mobile`]) {
    const out = join(dir, `${slug}.md`);
    if (existsSync(out)) continue;
    const kind = slug.endsWith('-web') ? 'web' : 'mobile';
    const content = agentStub(slug, kind);
    if (!content) continue;
    writeFileSync(out, content, 'utf8');
    console.log(`agent: ${out}`);
  }
}

function memoryStub(slug) {
  return `---
name: app-${slug}
description: Project memory for ${slug} — non-derivable business facts, owners, third-party contacts.
metadata:
  type: project
---

Per-app project memory for \`${slug}\`. Linked from \`.claude/agents/${slug}.md\` and \`apps-registry.json#apps.${slug}\`.

<!-- TODO: capture non-derivable facts here -->

**Why:** Repository code does not encode business rationale or owner relationships; without this file, context is re-derived every session from \`package.json\` + AGENTS.md, missing the human side.

**How to apply:** When the user asks about \`${slug}\`, auto-load this file alongside \`.claude/agents/${slug}.md\`. Append new facts as they surface.
`;
}

function writeMemoryStubs() {
  const dir = '/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project';
  try {
    mkdirSync(dir, { recursive: true });
  } catch {
    // already exists
  }
  for (const slug of [`${appSlug}-web`, `${appSlug}-mobile`]) {
    const out = join(dir, `${slug}.md`);
    if (existsSync(out)) continue;
    writeFileSync(out, memoryStub(slug), 'utf8');
    console.log(`memory: ${out}`);
  }
}

appendRegistryEntries();
writeFenceFiles();
writeAgentStubs();
writeMemoryStubs();

console.log(
  `\nCreated ${appSlug} (web:${webPort}, mobile:${mobilePort}, providers:on). Registry + fences + agent stubs + memory stubs written.\nNext manual steps:\n  - Fill ## Domain Glossary and ## Invariants in each .claude/agents/<app>.md.\n  - Update fence files branch scope.\n  - Replace owner = TBD in apps-registry.json.\n  - Append a ## ${today} row to CHECKPOINT.md.\n`,
);
