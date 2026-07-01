// Per-project deployment config for the 3-tier release flow.
//
// 3-tier model (per AGENTS.md):
//   feat/* ─PR─→ development ─release.sh─→ preview ─release.sh─→ production
//
// Branch tracking is global: every app builds off the same 'preview'
// and 'production' branches. Vercel's per-project Ignored Build Step
// (tooling/scripts/vercel-ignored-build.mjs) gates per-app relevance
// via this config + a git-diff check, so an app whose files don't
// change still skips its own build even when preview or production
// is updated.
//
// Why global branches instead of per-app (preview-<slug>):
// - The release.sh promotion model fast-forwards preview and
//   production across the whole repo. Per-app preview branches
//   fragment the deployment story (each app would need its own
//   promotion pipeline).
// - Vercel Hobby auto-deploys every non-production branch by
//   default; the strict branch gate in vercel-ignored-build.mjs
//   keeps the deploy count sane (only preview + production).
// - The git-diff relevance check inside the script handles the
//   per-app dimension: a docs-only push to preview still skips
//   every app's build.

export const sharedPaths = {
  root: ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'turbo.json'],
  ts: ['packages/typescript-config'],
  design: ['packages/design-system'],
  core: ['packages/core'],
  ui: ['packages/ui'],
  uiWeb: ['packages/ui-web'],
  uiNative: ['packages/ui-native'],
  tailwind: ['packages/tailwind-config'],
};

const productModules = {
  'one-pt': 'packages/modules/one-plan-trip',
  'two-sb': 'packages/modules/two-split-bill',
  'four-yc': 'packages/modules/four-you-closet',
  'five-bg': 'packages/modules/five-barber-go',
  'six-sp': 'packages/modules/six-sense-proof',
  'seven-rc': 'packages/modules/seven-reservations-club',
  'eight-dd': 'packages/modules/eight-dream-dishes',
  'nine-nr': 'packages/modules/nine-to-nine-nurse',
  'nine-cc': 'packages/modules/nine-care-companion',
};

const PREVIEW_BRANCH = 'preview';
const PRODUCTION_BRANCH = 'production';
const ALLOWED_BRANCHES = [PREVIEW_BRANCH, PRODUCTION_BRANCH];

function appConfig({
  app,
  paths,
  productionBranch = PRODUCTION_BRANCH,
  previewBranch = PREVIEW_BRANCH,
}) {
  return {
    app,
    previewBranch,
    productionBranch,
    allowedBranches: ALLOWED_BRANCHES,
    paths: [...sharedPaths.root, ...sharedPaths.ts, ...paths],
  };
}

function productAppConfigs(slug) {
  const modulePath = productModules[slug];

  return {
    [`${slug}-web`]: appConfig({
      app: `${slug}-web`,
      paths: [
        `apps/${slug}-web`,
        modulePath,
        ...sharedPaths.core,
        ...sharedPaths.ui,
        ...sharedPaths.uiWeb,
        ...sharedPaths.design,
        ...sharedPaths.tailwind,
      ],
    }),
    [`${slug}-mobile`]: appConfig({
      app: `${slug}-mobile`,
      paths: [
        `apps/${slug}-mobile`,
        modulePath,
        ...sharedPaths.core,
        ...sharedPaths.ui,
        ...sharedPaths.uiNative,
        ...sharedPaths.design,
        ...sharedPaths.tailwind,
      ],
    }),
  };
}

export const deploymentConfig = {
  landing: appConfig({
    app: 'landing',
    paths: [
      'apps/landing',
      ...sharedPaths.core,
      ...sharedPaths.ui,
      ...sharedPaths.uiWeb,
      ...sharedPaths.design,
      ...sharedPaths.tailwind,
    ],
  }),
  admin: appConfig({
    app: 'admin',
    paths: [
      'apps/admin',
      ...sharedPaths.core,
      ...sharedPaths.ui,
      ...sharedPaths.uiWeb,
      ...sharedPaths.design,
      ...sharedPaths.tailwind,
    ],
  }),
  ...productAppConfigs('one-pt'),
  ...productAppConfigs('two-sb'),
  ...productAppConfigs('four-yc'),
  ...productAppConfigs('five-bg'),
  ...productAppConfigs('six-sp'),
  ...productAppConfigs('seven-rc'),
  ...productAppConfigs('eight-dd'),
  ...productAppConfigs('nine-nr'),
  ...productAppConfigs('nine-cc'),
};

export const previewBranches = [PREVIEW_BRANCH];
export const productionBranches = [PRODUCTION_BRANCH];
