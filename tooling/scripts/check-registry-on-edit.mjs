#!/usr/bin/env node
// PreToolUse hook: blocks Edit/Write/MultiEdit on `apps/<unknown-slug>/`
// paths when the slug is not in `apps-registry.json` or has no fence file.
//
// Reads JSON from stdin:
//   { "tool_name": "Edit", "tool_input": { "file_path": "/abs/path" } }
//
// Exit codes:
//   0  — allow (path outside apps/<slug>/, OR slug is registered and fenced).
//   2  — block. stderr is shown to Claude; stdout is shown to user.
//
// Resolves paths from this file's location. Works regardless of cwd.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_ROOT = join(__dirname, '..', '..');
const WORKSPACE_ROOT = join(CLIENT_ROOT, '..');
const REGISTRY_PATH = join(WORKSPACE_ROOT, 'apps-registry.json');
const APPS_ROOT = join(CLIENT_ROOT, 'apps');

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw.trim()) process.exit(0);

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path;
if (typeof filePath !== 'string') process.exit(0);
if (!filePath.startsWith(APPS_ROOT)) process.exit(0);

const rel = filePath.slice(APPS_ROOT.length + 1).split('/');
const slug = rel[0];
if (!slug || slug.startsWith('.')) process.exit(0);

if (!existsSync(REGISTRY_PATH)) {
  die(`REGISTRY_MISSING: ${REGISTRY_PATH}`);
}

let reg;
try {
  reg = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
} catch (err) {
  die(`REGISTRY_PARSE_ERROR: ${err.message}`);
}

const entry = reg.apps?.[slug];
if (!entry) {
  die(
    `BLOCKED: apps/${slug}/ is not in apps-registry.json. ` +
      `Run /new-app to scaffold a new app, or ask the user to add the entry.`,
  );
}

// Allowed-only check: fence file must exist (PR1 contract).
const fenceAbs = join(WORKSPACE_ROOT, entry.fenceFile);
if (entry.fenceFile && !existsSync(fenceAbs)) {
  die(
    `BLOCKED: apps/${slug}/ has no fence file at ${entry.fenceFile}. ` +
      `Run tooling/scripts/bootstrap-existing-agents.mjs or regenerate.`,
  );
}

process.exit(0);
