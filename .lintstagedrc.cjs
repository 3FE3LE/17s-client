module.exports = {
  '*.{ts,tsx,js,jsx,cjs,mjs,json,md,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx,js,jsx}': [
    () => "pnpm turbo run lint --filter='./apps/*' --filter='./packages/*' --filter='./tooling/*'",
  ],
};
