#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..', '..');
const appsDir = join(root, 'apps');

function listProductSlugs() {
  if (!existsSync(appsDir)) return [];
  const entries = readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return entries
    .filter((name) => name.endsWith('-web'))
    .map((name) => name.slice(0, -4))
    .sort();
}

function normalizeEnvFlagValue(value) {
  if (value == null) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === '' || normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function parseSelection(args, knownSlugs) {
  let product = null;
  let dryRun = false;
  let cleanupPorts = true;
  const requestedFlags = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--no-cleanup-ports') {
      cleanupPorts = false;
      continue;
    }

    if (arg === '--product' && args[i + 1]) {
      product = args[i + 1];
      i += 1;
      continue;
    }

    if (arg.startsWith('--product=')) {
      product = arg.split('=')[1];
      continue;
    }

    if (arg.startsWith('--')) {
      requestedFlags.push(arg.slice(2));
      continue;
    }

    if (!product) {
      product = arg;
    }
  }

  if (!product && requestedFlags.length > 0) {
    const matchedFlags = requestedFlags.filter((flag) => knownSlugs.includes(flag));
    if (matchedFlags.length === 1) {
      product = matchedFlags[0];
    }
  }

  if (!product && process.env.npm_config_product) {
    product = process.env.npm_config_product;
  }

  if (!product) {
    const envMatches = knownSlugs.filter((slug) => {
      const envKey = `npm_config_${slug.replace(/-/g, '_')}`;
      return normalizeEnvFlagValue(process.env[envKey]);
    });

    if (envMatches.length === 1) {
      product = envMatches[0];
    }
  }

  return { dryRun, product, cleanupPorts };
}

function usage(knownSlugs) {
  console.error('Usage:');
  console.error('  pnpm run dev:product --product=<product-slug>');
  console.error('  pnpm run dev:product --<product-slug>');
  console.error('  pnpm run dev:product <product-slug>');
  console.error('');
  console.error(`Available products: ${knownSlugs.join(', ')}`);
}

const knownSlugs = listProductSlugs();
const { product, dryRun, cleanupPorts } = parseSelection(process.argv.slice(2), knownSlugs);

if (!product || !knownSlugs.includes(product)) {
  usage(knownSlugs);
  process.exit(1);
}

const webDir = join(appsDir, `${product}-web`);
const mobileDir = join(appsDir, `${product}-mobile`);

if (!existsSync(webDir) || !existsSync(mobileDir)) {
  console.error(
    `Missing app pair for '${product}'. Expected apps/${product}-web and apps/${product}-mobile.`,
  );
  process.exit(1);
}

function readScript(packageDir, scriptName) {
  try {
    const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
    const script = pkg?.scripts?.[scriptName];
    return typeof script === 'string' ? script : null;
  } catch {
    return null;
  }
}

function parsePort(scriptValue) {
  if (!scriptValue) return null;
  const match = scriptValue.match(/--port\s+(\d+)/);
  return match ? Number(match[1]) : null;
}

function checkPortAvailable(port) {
  return new Promise((resolvePort) => {
    const server = createServer();
    server.once('error', (error) => {
      if (error && typeof error === 'object' && 'code' in error) {
        resolvePort(error.code !== 'EADDRINUSE');
        return;
      }
      resolvePort(false);
    });
    server.once('listening', () => {
      server.close(() => resolvePort(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

function findMatchingPids(port) {
  const result = spawnSync('ps', ['-eo', 'pid=,args='], {
    encoding: 'utf8',
    cwd: root,
    env: process.env,
  });
  if (result.status !== 0) return [];
  const out = result.stdout ?? '';
  return out
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const firstSpace = line.indexOf(' ');
      if (firstSpace < 0) return null;
      const pid = Number(line.slice(0, firstSpace).trim());
      const args = line.slice(firstSpace + 1);
      return { pid, args };
    })
    .filter((row) => row && Number.isInteger(row.pid))
    .filter(
      (row) =>
        row.args.includes(`--port ${port}`) &&
        (row.args.includes('next dev') || row.args.includes('expo start')),
    )
    .map((row) => row.pid);
}

function cleanupPortProcesses(port) {
  const pids = findMatchingPids(port).filter((pid) => pid !== process.pid);
  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Ignore already-exited processes.
    }
  }
  return pids;
}

const webPort = parsePort(readScript(webDir, 'dev'));
const mobilePort = parsePort(readScript(mobileDir, 'dev'));
const landingPort = parsePort(readScript(join(appsDir, 'landing'), 'dev'));
const portsToCheck = [landingPort, webPort, mobilePort].filter((port) => Number.isInteger(port));

const turboArgs = [
  'turbo',
  'run',
  'dev:product',
  '--parallel',
  '--continue=always',
  '--filter',
  './apps/landing',
  '--filter',
  `./apps/${product}-web`,
  '--filter',
  `./apps/${product}-mobile`,
];

if (dryRun) {
  console.log(`pnpm ${turboArgs.join(' ')}`);
  process.exit(0);
}

if (cleanupPorts) {
  for (const port of portsToCheck) {
    cleanupPortProcesses(port);
  }
}

for (const port of portsToCheck) {
  const available = await checkPortAvailable(port);
  if (!available) {
    console.error(
      `Port ${port} is busy. Close the process using it and retry, ` +
        `or rerun with --no-cleanup-ports if you want to keep it.`,
    );
    process.exit(1);
  }
}

const child = spawn('pnpm', turboArgs, {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});

child.on('error', () => {
  process.exit(1);
});
