#!/usr/bin/env node
// Assert every `apps/*` and `packages/modules/*` directory in 17s-client
// has a matching entry in `apps-registry.json` (co-located at the repo root
// so CI can read it), and vice versa. Exits 1 on drift.
//
// Usage:
//   node tooling/scripts/check-registry.mjs
//
// Run from anywhere. Resolves paths from this file's location.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_ROOT = join(__dirname, '..', '..');
const WORKSPACE_ROOT = join(CLIENT_ROOT, '..');
// Prefer the co-located registry (17s-client/apps-registry.json, readable by
// CI which only checks out 17s-client) and fall back to the workspace-root
// copy. Works in either layout without configuration drift.
const LOCAL_REGISTRY = join(CLIENT_ROOT, 'apps-registry.json');
const REGISTRY_PATH = existsSync(LOCAL_REGISTRY)
  ? LOCAL_REGISTRY
  : join(WORKSPACE_ROOT, 'apps-registry.json');

if (!existsSync(REGISTRY_PATH)) {
  // Registry is a coordination artifact that lives in the workspace repo
  // (17s-workspace), not the 17s-client checkout. When the registry
  // isn't reachable (CI runs on 17s-client alone), skip the gate rather
  // than fail builds. Memory: project/registry-repo-scope.
  console.warn(
    `Registry not found at ${REGISTRY_PATH} — skipping check. ` +
      `This is expected when 17s-client CI runs without the workspace repo.`,
  );
  process.exit(0);
}

const reg = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const registered = new Set(Object.keys(reg.apps || {}));

const appsRoot = join(CLIENT_ROOT, 'apps');
const modulesRoot = join(CLIENT_ROOT, 'packages', 'modules');

function listDirs(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

const onDiskApps = new Set(listDirs(appsRoot));
const onDiskModules = new Set(listDirs(modulesRoot));

const expected = new Set([...onDiskApps]);

const drift = [];
for (const slug of [...registered].sort()) {
  const entry = reg.apps[slug];
  if (!entry) continue;
  // entry.appDir is workspace-relative (e.g. "17s-client/apps/admin"); strip
  // the leading "17s-client/" when resolving against CLIENT_ROOT so the
  // registry stays portable across repos.
  const rel = entry.appDir.replace(/^17s-client\//, '');
  const abs = join(CLIENT_ROOT, rel);
  if (!existsSync(abs)) {
    drift.push(`- registered app "${slug}" points at missing dir ${entry.appDir}`);
  }
}
for (const slug of [...expected].sort()) {
  if (!registered.has(slug)) {
    drift.push(`- on-disk app "${slug}" has no entry in apps-registry.json`);
  }
}

const moduleSlugsFromRegistry = new Set();
for (const entry of Object.values(reg.apps || {})) {
  if (entry.module) {
    const segs = entry.module.split('/');
    moduleSlugsFromRegistry.add(segs[segs.length - 1]);
  }
}
for (const m of [...onDiskModules].sort()) {
  if (!moduleSlugsFromRegistry.has(m)) {
    drift.push(`- module "${m}" on disk is not referenced by any registered app`);
  }
}

if (drift.length) {
  console.error('Registry drift:');
  for (const line of drift) console.error(line);
  process.exit(1);
}

console.log(
  `OK: ${registered.size} apps registered, ${expected.size} on disk, ${onDiskModules.size} modules on disk, no drift.`,
);
