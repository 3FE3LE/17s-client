#!/usr/bin/env bash
# Wrapper invoked by Vercel's "Ignore Build Step" override.
# Vercel projects (17s-seven-rc-web, 17s-fifteen-ac-web, 17s-admin, 17s-landing, ...)
# have the override set to `bash tooling/scripts/check-affected.sh <app>` from a
# pre-orchestration configuration. This wrapper forwards to the canonical
# implementation in vercel-ignored-build.mjs so the override keeps working
# without touching each Vercel project's UI settings.
#
# Usage: bash tooling/scripts/check-affected.sh <app-slug>

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <app-slug>" >&2
  exit 1
fi

APP="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec node "$SCRIPT_DIR/vercel-ignored-build.mjs" --app "$APP"
