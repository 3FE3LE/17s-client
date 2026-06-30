import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

/**
 * Verify that packages/core/src/api-schema.ts matches the openapi.json that
 * would be downloaded from the latest successful server CI run. Used as a CI
 * gate so DTO contract drift surfaces at PR time.
 *
 * Steps:
 *   1. Try to download the `openapi-spec` artifact from the latest
 *      successful `CI` workflow on `17Suit/17s-server` (HEAD of `main`).
 *   2. Save it to a temp path inside the workspace.
 *   3. Run `openapi-typescript` against it and diff the output against the
 *      committed `packages/core/src/api-schema.ts`.
 *   4. Exit 1 on drift, 0 if in sync or if the artifact could not be
 *      downloaded (so missing infra never blocks a PR — that's a follow-up
 *      job, not a contract issue).
 */

const ARTIFACT_NAME = 'openapi-spec';
const REPO = '17Suit/17s-server';
const SCHEMA_PATH = resolve(process.cwd(), 'packages/core/src/api-schema.ts');

function run(cmd: string, args: string[]): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  return {
    status: result.status ?? 0,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function info(message: string): void {
  process.stdout.write(`[verify-api-schema] ${message}\n`);
}

function main(): void {
  info(`Fetching latest ${ARTIFACT_NAME} artifact from ${REPO}@main ...`);
  const download = run('gh', [
    'run',
    'download',
    ARTIFACT_NAME,
    '--repo',
    REPO,
    '--branch',
    'main',
  ]);

  if (download.status !== 0) {
    info(
      `Could not fetch artifact (exit ${download.status}); skipping contract check. ` +
        'Either the server CI has not run on main yet, or `gh` is not authenticated.',
    );
    info(download.stderr.trim());
    return;
  }

  const downloaded = resolve(process.cwd(), `${ARTIFACT_NAME}.json`);
  if (!existsSync(downloaded)) {
    info(`Artifact download reported success but ${downloaded} is missing. Skipping.`);
    return;
  }

  info(`Regenerating types from ${downloaded} ...`);
  const gen = run('pnpm', [
    '--filter',
    '@17suit/core',
    'exec',
    'openapi-typescript',
    downloaded,
    '-o',
    '/tmp/api-schema.generated.ts',
  ]);
  if (gen.status !== 0) {
    process.stderr.write(gen.stderr);
    process.exit(1);
  }

  const diff = run('diff', ['-u', SCHEMA_PATH, '/tmp/api-schema.generated.ts']);
  if (diff.status === 0) {
    info('Schema is in sync with server.');
    return;
  }

  process.stderr.write(
    'packages/core/src/api-schema.ts is out of date with the server OpenAPI spec.\n' +
      'Run `cd 17s-server && pnpm export:openapi` then ' +
      '`pnpm --filter @17suit/core gen:api-schema` and commit the result.\n\n' +
      diff.stdout,
  );
  process.exit(1);
}

main();
