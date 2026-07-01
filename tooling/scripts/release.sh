#!/usr/bin/env bash
# Promote pre-release -> prod with a vX.Y.Z tag.
#
# Run from a clean local clone that has both `prod` and `pre-release`
# checked out as remotes (or branches). Verifies that pre-release is a
# fast-forward of prod before pushing, so the merge to prod stays linear.
#
# Usage:
#   ./tooling/scripts/release.sh v0.4.2
#
# What it does:
#   1. Verifies the working tree is clean.
#   2. Fetches from origin.
#   3. Checks out prod and fast-forwards it to pre-release.
#   4. Creates an annotated tag.
#   5. Pushes both. Vercel deploys production per affected app.

set -euo pipefail

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
  echo "Usage: $0 vX.Y.Z"
  echo "  e.g. $0 v0.4.2"
  exit 1
fi

if ! [[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
  echo "Version must look like v0.4.2 or v1.0.0-rc.1"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty. Commit or stash before releasing."
  exit 1
fi

echo "Fetching from origin..."
git fetch origin

echo "Verifying pre-release is a fast-forward of prod..."
if ! git merge-base --is-ancestor origin/prod origin/pre-release 2>/dev/null; then
  echo "pre-release is not a descendant of prod. Sync first:"
  echo "  git checkout pre-release && git merge --ff-only origin/prod"
  exit 1
fi

echo "Checking out prod and fast-forwarding to pre-release..."
git checkout prod
git merge --ff-only origin/pre-release

echo "Creating tag $VERSION..."
git tag -a "$VERSION" -m "Release $VERSION"

echo "Pushing prod and $VERSION to origin..."
git push origin prod "$VERSION"

echo ""
echo "Released $VERSION."
echo "Vercel is now building the production envs for affected apps."
echo "Next: monitor the deploys, then start the next cycle of PRs into pre-release."