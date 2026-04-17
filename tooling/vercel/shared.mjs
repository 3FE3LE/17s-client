export function createIgnoreCommand(app) {
  return `node ../../tooling/scripts/vercel-ignored-build.mjs --app ${app}`;
}

export function createAppVercelConfig(app) {
  return {
    ignoreCommand: createIgnoreCommand(app),
  };
}
