#!/usr/bin/env node
// Git `pre-push` gate. Blocks a push unless `pnpm ready` passed for the exact commit pushed.
//
// - Marker `.git/ready-<sha>` exists (written by `pnpm ready`): push proceeds.
// - Marker missing and the pushed commit is HEAD: runs `pnpm ready` now, then decides.
// - Marker missing and the pushed commit is not HEAD: blocks; check that branch out and run it.
// - `wip/*` branches, branch deletions and tags are not gated (remote backup only).
// Bypass: `git push --no-verify`. CI re-runs everything and stays the real gate.
// Hooks only exist after `pnpm install` (husky `prepare`).

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ZERO = /^0+$/;
const out = (argv) => execFileSync('git', argv, { encoding: 'utf8' }).trim();

const lines = readFileSync(0, 'utf8').split('\n').filter(Boolean);
const gitDir = out(['rev-parse', '--git-dir']);
const head = out(['rev-parse', 'HEAD']);
let ranReady = false;

for (const line of lines) {
  const [, localSha, remoteRef] = line.split(' ');
  if (ZERO.test(localSha)) continue; // deleting a remote ref
  if (!remoteRef.startsWith('refs/heads/')) continue; // tags and others
  const branch = remoteRef.slice('refs/heads/'.length);
  if (branch.startsWith('wip/')) {
    console.log(`pre-push: ${branch} is a wip backup branch, not gated.`);
    continue;
  }
  if (existsSync(join(gitDir, `ready-${localSha}`))) continue;

  if (localSha !== head) {
    console.error(
      `pre-push: ${branch} (${localSha.slice(0, 7)}) has no passing \`pnpm ready\` and is not the checked-out commit.\n` +
        'Check it out and run `pnpm ready`, or bypass with `git push --no-verify`.',
    );
    process.exit(1);
  }
  if (!ranReady) {
    console.log(`pre-push: no ready marker for ${localSha.slice(0, 7)}, running \`pnpm ready\`...`);
    if (spawnSync('pnpm', ['ready'], { stdio: 'inherit' }).status !== 0) {
      console.error('pre-push: `pnpm ready` failed, push blocked. Bypass: `git push --no-verify`.');
      process.exit(1);
    }
    ranReady = true;
  }
  if (!existsSync(join(gitDir, `ready-${localSha}`))) {
    console.error('pre-push: `pnpm ready` did not mark this commit (partial run?). Push blocked.');
    process.exit(1);
  }
}
