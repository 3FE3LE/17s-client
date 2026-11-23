#!/usr/bin/env node
// Selects the Playwright specs a change affects, per app.
//
// Each app declares ownership in `apps/<app>/e2e/flows.json`:
//   package  workspace package name (used by `pnpm --filter`)
//   smoke    specs that run when only shared code or unmapped app code changed
//   global   globs of shared packages; a change there runs the app's smoke specs
//   flows    { <name>: { specs: [...], paths: [globs] } }; a change on `paths` runs `specs`
//
// Modes:
//   flows  PR into development: affected flows plus smoke for affected apps.
//   full   promotion to preview (or manual run): every spec, but only for affected apps.
//
// Usage: node tooling/scripts/select-e2e.mjs --base <git-ref> [--mode flows|full] [--all]
//   --all  ignore the diff and select every app (workflow_dispatch).
// Output (stdout): {"any":bool,"include":[{"app","package","full","specs"}]}.
// Exit 1 when a flows.json is invalid; the message goes to stderr.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** Changes to CI plumbing re-check every app with its smoke specs. */
export const ROOT_GLOBAL = [
  'pnpm-lock.yaml',
  '.github/workflows/e2e.yml',
  'tooling/scripts/select-e2e.mjs',
];

export function globToRegExp(glob) {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') {
          out += '(?:.*/)?';
          i += 2;
        } else {
          out += '.*';
          i += 1;
        }
      } else {
        out += '[^/]*';
      }
    } else if (c === '?') {
      out += '[^/]';
    } else {
      out += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${out}$`);
}

const matches = (file, globs) => globs.some((g) => globToRegExp(g).test(file));

function listSpecs(dir, base = dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) found.push(...listSpecs(full, base));
    else if (/\.spec\.[cm]?[jt]sx?$/.test(name)) found.push(relative(base, full));
  }
  return found;
}

/** Throws on a malformed map. Every spec on disk must have an owner so it can be selected. */
export function validate(app, config, appDir) {
  const errors = [];
  const where = `apps/${app}/e2e/flows.json`;
  if (typeof config.package !== 'string' || !config.package)
    errors.push(`${where}: "package" required`);
  for (const key of ['smoke', 'global']) {
    if (!Array.isArray(config[key])) errors.push(`${where}: "${key}" must be an array`);
  }
  if (!config.flows || typeof config.flows !== 'object') errors.push(`${where}: "flows" required`);
  if (errors.length) throw new Error(errors.join('\n'));

  const declared = new Set(config.smoke ?? []);
  for (const [name, flow] of Object.entries(config.flows)) {
    if (!Array.isArray(flow.specs) || !flow.specs.length)
      errors.push(`${where}: flow "${name}" needs specs`);
    if (!Array.isArray(flow.paths) || !flow.paths.length)
      errors.push(`${where}: flow "${name}" needs paths`);
    for (const spec of flow.specs ?? []) declared.add(spec);
  }
  for (const spec of declared) {
    if (!existsSync(join(appDir, spec))) errors.push(`${where}: spec not found: ${spec}`);
  }
  for (const spec of listSpecs(join(appDir, 'e2e'), appDir)) {
    if (!declared.has(spec))
      errors.push(`${where}: spec has no owner (add it to a flow or smoke): ${spec}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

/** Pure selection for one app. Returns null when the change does not affect the app. */
export function selectForApp(app, config, changed, mode) {
  const appPrefix = `apps/${app}/`;
  const e2ePrefix = `${appPrefix}e2e/`;
  const allSpecs = new Set(config.smoke);
  for (const flow of Object.values(config.flows)) flow.specs.forEach((s) => allSpecs.add(s));

  const specs = new Set();
  let affected = false;
  let runAll = false;

  for (const file of changed) {
    if (file.startsWith(e2ePrefix)) {
      affected = true;
      const rel = file.slice(appPrefix.length);
      if (allSpecs.has(rel)) specs.add(rel);
      else runAll = true; // flows.json, support files, fixtures: no way to know who uses them
      continue;
    }
    if (file === `${appPrefix}playwright.config.ts`) {
      affected = true;
      runAll = true;
      continue;
    }
    let hit = false;
    for (const flow of Object.values(config.flows)) {
      if (matches(file, flow.paths)) {
        flow.specs.forEach((s) => specs.add(s));
        hit = true;
      }
    }
    if (hit) {
      affected = true;
    } else if (
      file.startsWith(appPrefix) ||
      matches(file, config.global) ||
      matches(file, ROOT_GLOBAL)
    ) {
      affected = true;
      config.smoke.forEach((s) => specs.add(s));
    }
  }

  if (!affected) return null;
  const full = mode === 'full' || runAll;
  return {
    app,
    package: config.package,
    full,
    specs: full ? [] : [...specs].sort(),
  };
}

function loadApps() {
  const appsDir = join(ROOT, 'apps');
  const apps = [];
  for (const app of readdirSync(appsDir).sort()) {
    const file = join(appsDir, app, 'e2e', 'flows.json');
    if (!existsSync(file)) continue;
    const config = JSON.parse(readFileSync(file, 'utf8'));
    validate(app, config, join(appsDir, app));
    apps.push({ app, config });
  }
  return apps;
}

function changedFiles(base) {
  const out = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return out.split('\n').filter(Boolean);
}

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? undefined : argv[i + 1];
  };
  const mode = arg('--mode') ?? 'flows';
  if (!['flows', 'full'].includes(mode))
    throw new Error(`--mode must be flows or full, got ${mode}`);
  const all = argv.includes('--all');
  const base = arg('--base');
  if (!all && !base) throw new Error('--base <git-ref> is required unless --all is set');

  const apps = loadApps();
  const changed = all ? [] : changedFiles(base);
  const include = [];
  for (const { app, config } of apps) {
    const picked = all
      ? { app, package: config.package, full: true, specs: [] }
      : selectForApp(app, config, changed, mode);
    if (picked) include.push(picked);
  }
  process.stdout.write(`${JSON.stringify({ any: include.length > 0, include })}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
