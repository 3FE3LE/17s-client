#!/usr/bin/env bash
# Vercel Ignored Build Step, referenced by `ignoreCommand` in apps/<app>/vercel.json.
#
# Usage: vercel-ignore.sh <workspace-package-name>   e.g. @17suit/landing
#
# Phase 1 (branch): build only `development`, `production` and `deploy/*`
#   (opt-in preview for a PR). Never feat/*, fix/*, chore/*, ci/*, test/*, docs/*,
#   release/*. `preview` is a CI gate only and does not deploy on Vercel.
# Phase 2 (changes): `turbo-ignore` walks the real dependency graph of the package
#   (apps, packages/*, packages/modules/*) and compares against the last successful
#   deployment, so a blocked build recovers on the next push.
#
# Exit codes (Vercel convention): 0 = skip build, 1 = build.
# Override: VERCEL_IGNORE_FORCE_BUILD=1 builds regardless (redeploys, debugging).

set -uo pipefail

PACKAGE="${1:-}"
if [ -z "$PACKAGE" ]; then
  echo "[build] vercel-ignore: missing package argument, building to be safe"
  exit 1
fi

if [ "${VERCEL_IGNORE_FORCE_BUILD:-}" = "1" ]; then
  echo "[build] ${PACKAGE}: VERCEL_IGNORE_FORCE_BUILD=1"
  exit 1
fi

BRANCH="${VERCEL_GIT_COMMIT_REF:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)}"

case "$BRANCH" in
  development | production | deploy/*) ;;
  *)
    echo "[skip] ${PACKAGE}: branch '${BRANCH}' is not deployed (allowed: development, production, deploy/*)"
    exit 0
    ;;
esac

echo "[check] ${PACKAGE}: branch '${BRANCH}' allowed, running turbo-ignore"
npx --yes turbo-ignore@^2 "$PACKAGE" --fallback=HEAD^
