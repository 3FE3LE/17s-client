import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { previewBranches } from './deployment-config.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');

function git(args) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  }

  return result.stdout.trim();
}

const existingBranches = new Set(
  git(['branch', '--list'])
    .split('\n')
    .map((line) => line.trim().replace(/^\*\s*/, ''))
    .filter(Boolean),
);

for (const branch of previewBranches) {
  if (existingBranches.has(branch)) {
    console.log(`= ${branch} already exists`);
    continue;
  }

  git(['branch', branch, 'main']);
  console.log(`+ created ${branch} from main`);
}
