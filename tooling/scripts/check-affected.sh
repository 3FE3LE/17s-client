#!/usr/bin/env bash
# Vercel Ignored Build Step — per-app filter.
#
# Drops the build for this Vercel project when the latest commit does not
# touch the app's own files or the shared packages it depends on. Vercel
# only invokes this script for commits on `prod` or `pre-release`.
#
# Usage per Vercel project: paste the script body into the Ignored Build
# Step field, replacing `<app-dir>` with the app's folder name
# (e.g. `landing`, `admin`, `fifteen-ac-web`).
#
# Exit codes (Vercel convention):
#   0 — skip the build
#   1 — proceed with the build

set -euo pipefail

APP_DIR="${1:-}" # pass the app name as the first argument, e.g. `landing`

if [ -z "$APP_DIR" ]; then
  echo "Usage: $0 <app-dir>"
  exit 0
fi

# Paths that should trigger this app's build when changed.
# Includes the app's own source and any shared package it imports from.
WATCH_PATHS=(
  "apps/${APP_DIR}"
  "packages/ui-web"
  "packages/ui"
  "packages/core"
  "packages/design-system"
  "packages/tailwind-config"
  "package.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "turbo.json"
)

# Vercel passes the commit SHA in VERCEL_GIT_COMMIT_SHA. If unavailable
# (e.g. running locally), fall back to HEAD.
COMMIT_SHA="${VERCEL_GIT_COMMIT_SHA:-HEAD}"
# Compare against the previous commit; on the very first push, Vercel sets
# VERCEL_GIT_PREVIOUS_SHA so we can diff against it.
PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-${COMMIT_SHA}~1}"

if [ "$COMMIT_SHA" = "$PREVIOUS_SHA" ]; then
  echo "No diff (single-commit push); skipping build for ${APP_DIR}"
  exit 0
fi

CHANGED_PATHS=$(git diff --name-only "$PREVIOUS_SHA" "$COMMIT_SHA" 2>/dev/null || true)

if [ -z "$CHANGED_PATHS" ]; then
  echo "git diff returned no paths; skipping build for ${APP_DIR}"
  exit 0
fi

for watch in "${WATCH_PATHS[@]}"; do
  if echo "$CHANGED_PATHS" | grep -q "^${watch}"; then
    echo "Changes touch '${watch}' — building ${APP_DIR}"
    exit 1
  fi
done

echo "No ${APP_DIR}-relevant changes in $PREVIOUS_SHA..$COMMIT_SHA — skipping build"
exit 0