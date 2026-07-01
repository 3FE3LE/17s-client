import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deploymentConfig } from './deployment-config.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');

function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });

  return result;
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    args[token.slice(2)] = argv[index + 1];
    index += 1;
  }

  return args;
}

const args = parseArgs(process.argv.slice(2));
const app = args.app;

if (!app || !(app in deploymentConfig)) {
  console.error(
    'Missing or unknown --app. Expected one of:',
    Object.keys(deploymentConfig).join(', '),
  );
  process.exit(1);
}

const config = deploymentConfig[app];
const branch =
  process.env.VERCEL_GIT_COMMIT_REF ?? git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA ?? 'HEAD';
const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA;

if (!config.allowedBranches.includes(branch)) {
  // Branch is outside the conventional list (e.g. feat/* or development).
  // We DON'T skip the build — Vercel Hobby auto-deploys every
  // non-production branch and we want every push to produce a preview.
  // The git-diff check below decides per-app relevance, so an app
  // whose files don't change still skips its own build, but other
  // apps in the same push build and deploy normally.
  console.log(
    `[info] ${app}: branch ${branch} not in allowedBranches, falling through to diff check`,
  );
}

let baseSha = previousSha;

if (!baseSha) {
  const fallback = git(['rev-parse', `${currentSha}^`]);
  if (fallback.status === 0) {
    baseSha = fallback.stdout.trim();
  }
}

if (!baseSha) {
  console.log(`[build] ${app}: no previous SHA available, allowing build`);
  process.exit(1);
}

const diff = git(['diff', '--name-only', baseSha, currentSha, '--', ...config.paths]);

if (diff.status !== 0) {
  console.log(`[build] ${app}: diff check failed, allowing build`);
  process.exit(1);
}

const changedFiles = diff.stdout
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (changedFiles.length === 0) {
  console.log(`[skip] ${app}: no relevant changes for ${branch}`);
  process.exit(0);
}

console.log(`[build] ${app}: relevant changes detected`);
for (const file of changedFiles) {
  console.log(` - ${file}`);
}
process.exit(1);
