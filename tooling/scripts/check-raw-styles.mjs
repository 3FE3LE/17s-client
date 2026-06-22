import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const scanAll = process.argv.includes('--all');
const scanRoots = scanAll
  ? ['apps', 'packages']
  : [
      'apps/seven-rc-web/app/page.tsx',
      'apps/fifteen-ac-web/components',
      'packages/ui-web/src/components/AppButton.tsx',
      'packages/ui-web/src/components/AppCard.tsx',
      'packages/ui-web/src/components/AppInput.tsx',
      'packages/ui-web/src/components/AppWorkspaceShell.tsx',
      'packages/ui-native/src/components/AppButton.tsx',
      'packages/ui-native/src/components/AppCard.tsx',
      'packages/ui-native/src/components/AppInput.tsx',
    ];
const extensions = new Set(['.css', '.ts', '.tsx']);
const allowedPathParts = [
  ['packages', 'tailwind-config'],
  ['packages', 'design-system', 'src', 'tokens.ts'],
];

const rawStylePatterns = [
  { name: 'hex color', pattern: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb/rgba color', pattern: /rgba?\([^)]*\)/g },
  { name: 'arbitrary bg', pattern: /\bbg-\[[^\]]+\]/g },
  { name: 'arbitrary border rgba', pattern: /\bborder-\[rgba[^\]]+\]/g },
  { name: 'arbitrary shadow', pattern: /\bshadow-\[[^\]]+\]/g },
  { name: 'raw translucent white surface', pattern: /\bbg-white\/(?:60|70|74|80|82|90)\b/g },
  { name: 'raw black border', pattern: /\bborder-black\/\d+\b/g },
];

function isAllowedPath(filePath) {
  const parts = filePath.split(sep);
  return allowedPathParts.some((allowedParts) =>
    allowedParts.every((part, index) => parts[index] === part),
  );
}

function getExtension(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

function collectFiles(dirPath, files = []) {
  const stat = statSync(dirPath);

  if (stat.isFile()) {
    if (extensions.has(getExtension(dirPath))) {
      files.push(dirPath);
    }

    return files;
  }

  for (const entry of readdirSync(dirPath)) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'dist' || entry === '.turbo') {
      continue;
    }

    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      collectFiles(fullPath, files);
      continue;
    }

    if (extensions.has(getExtension(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

const findings = [];

for (const scanRoot of scanRoots) {
  const absoluteRoot = join(root, scanRoot);
  for (const file of collectFiles(absoluteRoot)) {
    const filePath = relative(root, file);
    if (isAllowedPath(filePath)) continue;

    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      rawStylePatterns.forEach(({ name, pattern }) => {
        pattern.lastIndex = 0;
        const matches = line.match(pattern);
        if (!matches) return;

        matches.forEach((match) => {
          findings.push({
            filePath,
            line: index + 1,
            name,
            match,
          });
        });
      });
    });
  }
}

if (findings.length > 0) {
  console.error('Raw style values found outside token/theme files:');
  findings.slice(0, 80).forEach((finding) => {
    console.error(
      `${finding.filePath}:${finding.line} ${finding.name}: ${JSON.stringify(finding.match)}`,
    );
  });

  if (findings.length > 80) {
    console.error(`...and ${findings.length - 80} more`);
  }

  process.exit(1);
}

console.log('No raw style values found outside token/theme files.');
