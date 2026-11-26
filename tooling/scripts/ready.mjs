#!/usr/bin/env node
// Local quality gate: `pnpm ready`. Runs what CI runs, scoped to what changed, and stops on
// the first failure. On success writes `.git/ready-<HEAD sha>`, which the `pre-push` hook
// (added separately) checks. The marker is local and never committed.
//
// Usage: pnpm ready [--fast] [--no-e2e]
//   --fast    lint + typecheck only, no marker (use before pushing a `wip/*` backup branch)
//   --no-e2e  skip Playwright; no marker, because the gate did not fully run
//
// Steps: prettier on changed files, lint + typecheck (turbo --affected), design tokens,
// apps registry, API schema when packages/core changed, unit tests for the diff
// (vitest --changed), and the Playwright flows selected by tooling/scripts/select-e2e.mjs
// (same selection as the PR e2e job, docs/e2e-selection.md).

import { execFileSync, spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = new Set(process.argv.slice(2));
const fast = args.has('--fast');
const skipE2e = args.has('--no-e2e');

const run = (cmd, argv, env = {}) =>
  spawnSync(cmd, argv, { stdio: 'inherit', env: { ...process.env, ...env } }).status === 0;
const out = (cmd, argv) => execFileSync(cmd, argv, { encoding: 'utf8' }).trim();
const hasRef = (ref) => spawnSync('git', ['rev-parse', '--verify', '-q', ref]).status === 0;

const base = ['origin/development'].find(hasRef);
if (!base) {
  console.error('ready: origin/development not found; run `git fetch origin`.');
  process.exit(1);
}

const changed = out('git', ['diff', '--name-only', '--diff-filter=d', `${base}...HEAD`])
  .split('\n')
  .filter(Boolean);
if (out('git', ['status', '--porcelain'])) {
  console.warn('ready: uncommitted changes are checked but not pushed.');
}

const turboEnv = { TURBO_SCM_BASE: base };
const prettierFiles = changed.filter((f) => /\.(ts|tsx|js|jsx|cjs|mjs|json|md|ya?ml)$/.test(f));

const steps = [];
if (prettierFiles.length) {
  steps.push([
    'prettier (changed files)',
    () => run('pnpm', ['exec', 'prettier', '--check', ...prettierFiles]),
  ]);
}
steps.push([
  'lint + typecheck (affected packages)',
  () => run('pnpm', ['exec', 'turbo', 'run', 'lint', 'typecheck', '--affected'], turboEnv),
]);

if (!fast) {
  steps.push(['design tokens', () => run('pnpm', ['tokens:check'])]);
  steps.push(['apps registry', () => run('node', ['tooling/scripts/check-registry.mjs'])]);
  if (changed.some((f) => f.startsWith('packages/core/'))) {
    steps.push(['api schema', () => run('pnpm', ['verify:api-schema'])]);
  }
  steps.push([
    `unit tests (changed since ${base})`,
    () =>
      run(
        'pnpm',
        [
          'exec',
          'turbo',
          'run',
          'test',
          '--affected',
          '--',
          '--changed',
          base,
          '--passWithNoTests',
        ],
        turboEnv,
      ),
  ]);
  if (!skipE2e) {
    steps.push([
      'e2e (selected flows)',
      () => {
        const sel = JSON.parse(
          out('node', ['tooling/scripts/select-e2e.mjs', '--base', base, '--mode', 'flows']),
        );
        if (!sel.any) {
          console.log('ready: no e2e flow affected.');
          return true;
        }
        return sel.include.every(({ app, package: pkg, specs }) => {
          console.log(`ready: e2e ${app}${specs.length ? ` (${specs.length} specs)` : ' (full)'}`);
          return run('pnpm', ['--filter', pkg, 'exec', 'playwright', 'test', ...specs]);
        });
      },
    ]);
  }
}

for (const [name, fn] of steps) {
  console.log(`\nready: ${name}`);
  if (!fn()) {
    console.error(`\nready: FAILED at "${name}"`);
    process.exit(1);
  }
}

if (fast || skipE2e) {
  console.log('\nready: OK (partial run, no marker written)');
} else {
  const sha = out('git', ['rev-parse', 'HEAD']);
  writeFileSync(
    join(out('git', ['rev-parse', '--git-dir']), `ready-${sha}`),
    `${new Date().toISOString()}\n`,
  );
  console.log('\nready: OK');
}
