const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;

// Nearest ancestor directory (below the repo root) whose package.json defines `lint`.
function lintPackageDir(file) {
  let dir = path.dirname(file);
  while (dir.startsWith(ROOT) && dir !== ROOT) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return pkg.scripts && pkg.scripts.lint ? dir : null;
    }
    dir = path.dirname(dir);
  }
  return null;
}

// Pre-commit lints only the staged files, grouped per package so each package's own ESLint
// config applies. Typecheck and tests run in `pnpm ready` (pre-push), not here.
function eslintStaged(files) {
  const groups = new Map();
  for (const file of files) {
    const dir = lintPackageDir(file);
    if (!dir) continue;
    groups.set(dir, [...(groups.get(dir) ?? []), path.relative(dir, file)]);
  }
  return [...groups].map(
    ([dir, rel]) =>
      `pnpm --dir ${path.relative(ROOT, dir)} exec eslint --fix --max-warnings=0 ${rel.join(' ')}`,
  );
}

module.exports = {
  '*.{ts,tsx,js,jsx,cjs,mjs,json,md,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx,js,jsx}': eslintStaged,
};
