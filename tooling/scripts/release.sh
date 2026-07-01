#!/usr/bin/env bash
# Promote one release branch to the next in the 3-tier Vercel flow:
#   development -> preview -> production
#
# Both branches must already exist locally (or be fetchable from origin).
# Verifies that the target branch is a fast-forward of the source's
# ancestor chain before pushing, so the merge to target stays linear.
#
# Usage:
#   ./tooling/scripts/release.sh development preview v0.4.2-rc.1
#   ./tooling/scripts/release.sh preview production v0.4.2
#
# Allowed pairs:
#   development preview
#   preview production
#
# What it does:
#   1. Verifies the working tree is clean.
#   2. Fetches from origin.
#   3. Refuses to proceed if origin/<source> is not a descendant of
#      origin/<target> (would create a divergent merge).
#   4. Fast-forwards <target> to <source>.
#   5. Creates an annotated tag (only on the final promote-to-production).
#   6. Pushes both branches (and the tag when present).

set -euo pipefail

SOURCE="${1:-}"
TARGET="${2:-}"
VERSION="${3:-}"

usage() {
  cat <<EOF
Usage:
  $0 development preview [vX.Y.Z-rc.N]
  $0 preview production vX.Y.Z

Promotes the source branch's HEAD into the target branch via
fast-forward. The version tag is required for production promotions
and optional (but recommended) for preview RCs.

Examples:
  $0 development preview v0.4.2-rc.1   # dev -> preview as release candidate
  $0 preview production v0.4.2         # preview -> production as release
EOF
}

if [ -z "$SOURCE" ] || [ -z "$TARGET" ]; then
  usage
  exit 1
fi

case "$SOURCE:$TARGET" in
  development:preview) ;;
  preview:production) ;;
  *)
    echo "Error: only 'development preview' and 'preview production' promotions are supported."
    echo "Got: $SOURCE -> $TARGET"
    exit 1
    ;;
esac

if [ "$TARGET" = "production" ] && [ -z "$VERSION" ]; then
  echo "Error: a version tag is required when promoting to production."
  usage
  exit 1
fi

if [ -n "$VERSION" ] && ! [[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
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

echo "Verifying $SOURCE is a descendant of $TARGET..."
if ! git merge-base --is-ancestor "origin/$TARGET" "origin/$SOURCE" 2>/dev/null; then
  echo "Error: origin/$SOURCE is not a descendant of origin/$TARGET."
  echo "Sync first by promoting each tier in order:"
  echo "  git checkout $TARGET && git merge --ff-only origin/production"
  exit 1
fi

echo "Checking out $TARGET and fast-forwarding to $SOURCE..."
git checkout "$TARGET"
git merge --ff-only "origin/$SOURCE"

PUSH_ARGS=(origin "$TARGET" "$SOURCE")
if [ -n "$VERSION" ]; then
  echo "Creating tag $VERSION..."
  git tag -a "$VERSION" -m "Release $VERSION"
  PUSH_ARGS+=("$VERSION")
fi

echo "Pushing ${PUSH_ARGS[*]}..."
git push "${PUSH_ARGS[@]}"

echo ""
echo "Promoted $SOURCE -> $TARGET"
if [ -n "$VERSION" ]; then
  echo "Tagged $VERSION."
fi
echo "Vercel is now building the ${TARGET} env for affected apps."
echo "Next: monitor the deploys, then start the next cycle of PRs into development."