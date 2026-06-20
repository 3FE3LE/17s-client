import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseRef = process.env.TURBO_SCM_BASE || 'origin/main';
const packageRoots = ['apps', 'packages', 'packages/modules', 'tooling'];
const dependencyFields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `${command} ${args.join(' ')} failed`);
  }

  return result.stdout?.trim() ?? '';
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function workspacePackageDirs() {
  const dirs = [];

  for (const packageRoot of packageRoots) {
    const absoluteRoot = path.join(root, packageRoot);
    if (!existsSync(absoluteRoot)) {
      continue;
    }

    for (const entry of readdirSync(absoluteRoot)) {
      const absoluteDir = path.join(absoluteRoot, entry);
      if (!statSync(absoluteDir).isDirectory()) {
        continue;
      }

      const packageJson = path.join(absoluteDir, 'package.json');
      if (existsSync(packageJson)) {
        dirs.push(path.relative(root, absoluteDir));
      }
    }
  }

  return dirs;
}

function isWebBuildTarget(pkg) {
  return (
    /^apps\/[^/]+-web$/.test(pkg.dir) || pkg.dir === 'apps/admin' || pkg.dir === 'apps/landing'
  );
}

const packages = workspacePackageDirs().map((dir) => {
  const manifest = readJson(path.join(root, dir, 'package.json'));
  return { dir, name: manifest.name, manifest };
});

const packagesByName = new Map(packages.map((pkg) => [pkg.name, pkg]));
const packagesByDir = [...packages].sort((left, right) => right.dir.length - left.dir.length);
const dependentsByName = new Map(packages.map((pkg) => [pkg.name, new Set()]));

for (const pkg of packages) {
  for (const field of dependencyFields) {
    for (const dependencyName of Object.keys(pkg.manifest[field] ?? {})) {
      if (packagesByName.has(dependencyName)) {
        dependentsByName.get(dependencyName)?.add(pkg.name);
      }
    }
  }
}

const diffOutput = run('git', ['diff', '--name-only', `${baseRef}...HEAD`]);
const changedFiles = diffOutput.split('\n').filter(Boolean);
const changedPackages = new Set();

for (const file of changedFiles) {
  const owner = packagesByDir.find((pkg) => file === pkg.dir || file.startsWith(`${pkg.dir}/`));
  if (owner) {
    changedPackages.add(owner.name);
  }
}

const affectedPackages = new Set(changedPackages);
const pending = [...changedPackages];

while (pending.length > 0) {
  const current = pending.pop();
  for (const dependent of dependentsByName.get(current) ?? []) {
    if (!affectedPackages.has(dependent)) {
      affectedPackages.add(dependent);
      pending.push(dependent);
    }
  }
}

const affectedTargets = packages
  .filter((pkg) => isWebBuildTarget(pkg) && affectedPackages.has(pkg.name))
  .map((pkg) => pkg.name)
  .sort();

if (affectedTargets.length === 0) {
  console.log('No affected web apps found. Skipping build.');
  process.exit(0);
}

console.log(`Building affected web apps: ${affectedTargets.join(', ')}`);

const turboArgs = [
  'turbo',
  'run',
  'build',
  ...affectedTargets.map((target) => `--filter=${target}`),
];

if (process.env.CI_BUILD_DRY_RUN === 'true') {
  turboArgs.push('--dry=text');
}

run('pnpm', turboArgs, { stdio: 'inherit' });
