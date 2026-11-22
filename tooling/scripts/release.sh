#!/usr/bin/env bash
# Promote one tier to the next through a pull request:
#   development -> preview -> production
#
# `preview` and `production` require a linear history and `development` has
# merge commits, so a fast-forward push cannot work. A promotion is a single
# commit on top of the target whose tree is exactly the tree of the source.
# It goes through a PR, so every branch rule and required check still applies.
#
# A snapshot replaces the target's content, so it is refused unless everything
# in the target is already part of what is being promoted (see "Safety check").
# That is what keeps a promotion from silently reverting a hotfix.
#
# Nothing is checked out, merged or force-pushed; your working tree is untouched.
#
# Usage: see `usage` below and docs/releasing.md.

set -euo pipefail

usage() {
  cat <<EOF
Usage:
  $0 development preview [vX.Y.Z-rc.N] [--dry-run]
  $0 preview production vX.Y.Z [--dry-run]
  $0 tag <preview|production> vX.Y.Z[-rc.N]   # after the promotion PR merged

The promotion commands open a PR. Merge it with "Squash and merge".
EOF
}

fail() {
  echo "Error: $*" >&2
  exit 1
}

DRY_RUN=false
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    -*) fail "unknown option $arg." ;;
    *) ARGS+=("$arg") ;;
  esac
done

if [ "${#ARGS[@]}" -lt 2 ] || [ "${#ARGS[@]}" -gt 3 ]; then
  usage
  exit 1
fi

SOURCE="${ARGS[0]}"
TARGET="${ARGS[1]}"
VERSION="${ARGS[2]:-}"

case "$SOURCE:$TARGET" in
  development:preview | preview:production | tag:preview | tag:production) ;;
  *)
    usage
    exit 1
    ;;
esac

if [ -z "$VERSION" ] && { [ "$SOURCE" = "tag" ] || [ "$TARGET" = "production" ]; }; then
  fail "a version is required for tags and production promotions."
fi
if [ -n "$VERSION" ] && ! [[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
  fail "version must look like v0.4.2 or v1.0.0-rc.1."
fi

cd "$(dirname "${BASH_SOURCE[0]}")/../.."
git fetch --quiet origin

if [ -n "$VERSION" ]; then
  EXISTING_TAG="$(git ls-remote --tags origin "refs/tags/$VERSION")"
  [ -z "$EXISTING_TAG" ] || fail "tag $VERSION already exists on origin."
fi

if [ "$SOURCE" = "tag" ]; then
  SHA="$(git rev-parse "origin/$TARGET")"
  # The version is in the promotion's subject, so this refuses to tag before
  # the PR is merged, or after something else landed on the branch.
  SUBJECT="$(git log -1 --format=%s "$SHA")"
  case "$SUBJECT " in
    "chore(release): promote "*" to $TARGET $VERSION "*) ;;
    *) fail "the tip of origin/$TARGET is not the merged promotion of $VERSION." ;;
  esac
  if $DRY_RUN; then
    echo "[dry run] would tag $SHA as $VERSION."
    exit 0
  fi
  git tag -a "$VERSION" -m "Release $VERSION" "$SHA"
  git push origin "refs/tags/$VERSION"
  echo "Tagged origin/$TARGET ($SHA) as $VERSION."
  exit 0
fi

SOURCE_SHA="$(git rev-parse "origin/$SOURCE")"
TARGET_SHA="$(git rev-parse "origin/$TARGET")"
SOURCE_TREE="$(git rev-parse "$SOURCE_SHA^{tree}")"
TARGET_TREE="$(git rev-parse "$TARGET_SHA^{tree}")"

if [ "$SOURCE_TREE" = "$TARGET_TREE" ]; then
  echo "$TARGET already has the content of $SOURCE. Nothing to promote."
  exit 0
fi

# Newest commit reachable from $1 whose tree is $2 (empty when there is none).
commit_with_tree() {
  git log --format='%H %T' "$1" | awk -v tree="$2" '$2 == tree && !found { print $1; found = 1 }'
}

# Safety check, in two steps:
# 1. The source must be a state that existed on `development`. A direct change
#    on `preview` would be missing from the next promotion, which would revert it.
ORIGIN_SHA="$(commit_with_tree origin/development "$SOURCE_TREE")"
[ -n "$ORIGIN_SHA" ] ||
  fail "origin/$SOURCE has changes that are not in development. Bring them into development first."

# 2. The target must be contained in that state: either as an ancestor (synced
#    hotfix) or as an earlier state of it (previous promotion).
if ! git merge-base --is-ancestor "$TARGET_SHA" "$ORIGIN_SHA"; then
  CONTAINED="$(commit_with_tree "$ORIGIN_SHA" "$TARGET_TREE")"
  [ -n "$CONTAINED" ] || fail "origin/$TARGET has changes that this promotion would revert.
Promote a newer preview, or sync the hotfix first: docs/releasing.md#hotfixes."
fi

SHORT="${ORIGIN_SHA:0:10}"
TITLE="chore(release): promote $SOURCE to $TARGET${VERSION:+ $VERSION}"
BRANCH="release/$TARGET-$SHORT-${TARGET_SHA:0:10}"

if $DRY_RUN; then
  echo "[dry run] would open \"$TITLE\""
  echo "  content: development@$SHORT"
  echo "  base:    $TARGET@${TARGET_SHA:0:10}"
  echo "  changes:$(git diff --shortstat "$TARGET_SHA" "$SOURCE_SHA")"
  exit 0
fi

command -v gh >/dev/null || fail "the GitHub CLI (gh) is required to open the PR."

COMMIT="$(git commit-tree "$SOURCE_TREE" -p "$TARGET_SHA" -m "$TITLE" -m "Content of development@$ORIGIN_SHA.")"
git push origin "$COMMIT:refs/heads/$BRANCH"

NEXT=""
if [ -n "$VERSION" ]; then
  NEXT="After merging: \`./tooling/scripts/release.sh tag $TARGET $VERSION\`"
fi

gh pr create --base "$TARGET" --head "$BRANCH" --title "$TITLE" --body "## Summary

Promotes \`$SOURCE\` to \`$TARGET\`. The tree is identical to development@$ORIGIN_SHA.

Merge with **Squash and merge** and keep the title. Do not push fixes to this branch: fix in \`development\` and promote again.

$NEXT"
