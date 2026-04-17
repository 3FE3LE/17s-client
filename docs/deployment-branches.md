# Deployment Branches

## Goal

Control pre-production deployments per product so one change does not fan out into every app.

This repository now uses a product-level preview branch convention plus a Vercel ignore script.

## Preview Branches

- `preview-landing`
- `preview-admin`
- `preview-one-pt`
- `preview-two-sb`
- `preview-four-yc`
- `preview-five-bg`
- `preview-six-sp`
- `preview-seven-rc`
- `preview-eight-dd`
- `preview-nine-nr`

All surfaces of the same product share the same preview branch.

Examples:

- `seven-rc-web` and `seven-rc-mobile` both use `preview-seven-rc`
- `six-sp-web` and `six-sp-mobile` both use `preview-six-sp`

## Recommended Flow

1. Work from `main` into feature branches.
2. Merge only the product you want to validate into its preview branch.
3. Let the corresponding Vercel project deploy that preview branch.
4. Promote to `main` only when that product is ready.

This keeps pre-production isolated by product instead of coupling every app to every merge.

## Vercel Setup

For each Vercel project:

1. Keep the correct app root directory.
2. Enable Vercel monorepo skipping for unaffected projects.
3. Configure the Ignored Build Step with the matching app key.

Examples:

```bash
node ../../tooling/scripts/vercel-ignored-build.mjs --app landing
node ../../tooling/scripts/vercel-ignored-build.mjs --app admin
node ../../tooling/scripts/vercel-ignored-build.mjs --app seven-rc-web
node ../../tooling/scripts/vercel-ignored-build.mjs --app seven-rc-mobile
```

Behavior:

- If the branch is not `main` or the app's `preview-<slug>` branch, the script exits `0` and Vercel skips the build.
- If the branch is allowed but there are no relevant changes, the script exits `0` and Vercel skips the build.
- If the branch is allowed and relevant files changed, the script exits `1` and Vercel builds.

According to Vercel's documentation, Ignored Build Step exit code `0` skips the build, and `1` or higher allows it.

Source:

- https://vercel.com/docs/monorepos
- https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel

## Relevant Change Detection

Each app evaluates changes in:

- its own `apps/<app>` directory
- its product module under `packages/modules/*` when applicable
- shared packages it depends on, such as `packages/core`, `packages/ui`, `packages/ui-web`, `packages/ui-native`, `packages/design-system`, `packages/tailwind-config`, and `packages/typescript-config`
- monorepo root files like `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `turbo.json`

## Branch Creation

Create all preview branches locally with:

```bash
pnpm preview:branches:create
```

Then push the branches you want to activate:

```bash
git push origin preview-seven-rc
git push origin preview-six-sp
```
