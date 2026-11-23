// Run: node --test tooling/scripts/select-e2e.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { globToRegExp, selectForApp } from './select-e2e.mjs';

const config = {
  package: '@17suit/seven-rc-web',
  smoke: ['e2e/public-smoke.spec.ts'],
  global: ['packages/ui/**', 'packages/core/**'],
  flows: {
    'public-booking': {
      specs: ['e2e/public-booking.spec.ts'],
      paths: ['apps/seven-rc-web/app/c/**', 'apps/seven-rc-web/lib/public-venue-api.ts'],
    },
  },
};
const pick = (files, mode = 'flows') => selectForApp('seven-rc-web', config, files, mode);

test('glob: ** crosses directories, * does not', () => {
  assert.ok(globToRegExp('apps/x/app/c/**').test('apps/x/app/c/[slug]/page.tsx'));
  assert.ok(globToRegExp('packages/ui/**').test('packages/ui/src/a/b.ts'));
  assert.ok(!globToRegExp('packages/ui/**').test('packages/ui-web/src/a.ts'));
  assert.ok(globToRegExp('apps/x/*.ts').test('apps/x/a.ts'));
  assert.ok(!globToRegExp('apps/x/*.ts').test('apps/x/lib/a.ts'));
  assert.ok(globToRegExp('a/**/b.ts').test('a/b.ts'));
});

test('unrelated change selects nothing', () => {
  assert.equal(pick(['apps/landing/app/page.tsx', 'README.md']), null);
});

test('mapped file selects only its flow', () => {
  const r = pick(['apps/seven-rc-web/lib/public-venue-api.ts']);
  assert.deepEqual(r.specs, ['e2e/public-booking.spec.ts']);
  assert.equal(r.full, false);
});

test('shared package change selects smoke only', () => {
  const r = pick(['packages/ui/src/button.tsx']);
  assert.deepEqual(r.specs, ['e2e/public-smoke.spec.ts']);
});

test('unmapped app file falls back to smoke', () => {
  const r = pick(['apps/seven-rc-web/components/role-switch.tsx']);
  assert.deepEqual(r.specs, ['e2e/public-smoke.spec.ts']);
});

test('flow plus shared change selects both', () => {
  const r = pick(['apps/seven-rc-web/app/c/[slug]/page.tsx', 'packages/core/src/a.ts']);
  assert.deepEqual(r.specs, ['e2e/public-booking.spec.ts', 'e2e/public-smoke.spec.ts']);
});

test('editing a spec runs that spec', () => {
  const r = pick(['apps/seven-rc-web/e2e/public-booking.spec.ts']);
  assert.deepEqual(r.specs, ['e2e/public-booking.spec.ts']);
});

test('flows.json, support files and playwright config run everything', () => {
  for (const file of [
    'apps/seven-rc-web/e2e/flows.json',
    'apps/seven-rc-web/e2e/support/stub-api.mjs',
    'apps/seven-rc-web/playwright.config.ts',
  ]) {
    assert.equal(pick([file]).full, true, file);
  }
});

test('CI plumbing change selects smoke', () => {
  assert.deepEqual(pick(['pnpm-lock.yaml']).specs, ['e2e/public-smoke.spec.ts']);
});

test('full mode runs every spec for affected apps only', () => {
  assert.equal(pick(['packages/ui/src/button.tsx'], 'full').full, true);
  assert.equal(pick(['README.md'], 'full'), null);
});
