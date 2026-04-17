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
};

function appConfig({ app, previewBranch, paths, productionBranch = 'main' }) {
  return {
    app,
    previewBranch,
    productionBranch,
    allowedBranches: [previewBranch, productionBranch],
    paths: [...sharedPaths.root, ...sharedPaths.ts, ...paths],
  };
}

function productAppConfigs(slug) {
  const modulePath = productModules[slug];
  const previewBranch = `preview-${slug}`;

  return {
    [`${slug}-web`]: appConfig({
      app: `${slug}-web`,
      previewBranch,
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
      previewBranch,
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
    previewBranch: 'preview-landing',
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
    previewBranch: 'preview-admin',
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
};

export const previewBranches = [
  'preview-admin',
  'preview-landing',
  'preview-one-pt',
  'preview-two-sb',
  'preview-four-yc',
  'preview-five-bg',
  'preview-six-sp',
  'preview-seven-rc',
  'preview-eight-dd',
  'preview-nine-nr',
];
