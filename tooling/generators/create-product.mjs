#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [appSlug, moduleSlugArg, subdomainArg] = process.argv.slice(2);
if (!appSlug || !moduleSlugArg) {
  console.error(
    'Usage: pnpm --filter @17suit/tooling product:new <app-slug> <module-slug> [subdomain]',
  );
  process.exit(1);
}

const moduleSlug = moduleSlugArg;
const subdomain = subdomainArg ?? moduleSlugArg;

const root = process.cwd();
const mobileDir = join(root, 'apps', `${appSlug}-mobile`);
const webDir = join(root, 'apps', `${appSlug}-web`);
const moduleDir = join(root, 'packages', 'modules', moduleSlug);

const targets = [mobileDir, webDir, moduleDir];
for (const target of targets) {
  if (existsSync(target)) {
    console.error(`Target already exists: ${target}`);
    process.exit(1);
  }
}

const templateMobile = join(root, 'apps', 'eight-dd-mobile');
const templateWeb = join(root, 'apps', 'eight-dd-web');
const templateModule = join(root, 'packages', 'modules', 'eight-dream-dishes');

for (const template of [templateMobile, templateWeb, templateModule]) {
  if (!existsSync(template)) {
    console.error(`Template not found: ${template}`);
    process.exit(1);
  }
}

function toTitleCaseKebab(input) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function toPascalCaseKebab(input) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function nextFreePort(start, used) {
  let port = start;
  while (used.has(port)) {
    port += 1;
  }
  return port;
}

function collectUsedPorts(globSuffix, marker) {
  const used = new Set();
  const appsRoot = join(root, 'apps');
  const entries = readdirSync(appsRoot);
  for (const entry of entries) {
    if (!entry.endsWith(globSuffix)) continue;
    const pkgPath = join(appsRoot, entry, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const raw = readFileSync(pkgPath, 'utf8');
    const json = JSON.parse(raw);
    const dev = json.scripts?.dev;
    if (typeof dev !== 'string') continue;
    const match = dev.match(new RegExp(`${marker}(\\d+)`));
    if (match) used.add(Number(match[1]));
  }
  return used;
}

const usedWebPorts = collectUsedPorts('-web', '--port ');
const usedMobilePorts = collectUsedPorts('-mobile', '--port ');
const webPort = nextFreePort(3001, usedWebPorts);
const mobilePort = nextFreePort(8081, usedMobilePorts);

const productName = toTitleCaseKebab(moduleSlug);
const modulePascal = toPascalCaseKebab(moduleSlug);

const replacements = [
  ['eight-dd-mobile', `${appSlug}-mobile`],
  ['eight-dd-web', `${appSlug}-web`],
  ['eight-dd', appSlug],
  ['eight-dream-dishes', moduleSlug],
  ['EightDreamDishes', modulePascal],
  ['Eight Dream Dishes', productName],
  ['dishes.17suit.com', `${subdomain}.17suit.com`],
  ['3008', String(webPort)],
  ['8088', String(mobilePort)],
];

function applyReplacements(content) {
  let output = content;
  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }
  return output;
}

function copyTemplateFiles(sourceRoot, targetRoot, files) {
  for (const rel of files) {
    const src = join(sourceRoot, rel);
    const dest = join(targetRoot, rel);
    if (!existsSync(src)) {
      console.error(`Template file not found: ${src}`);
      process.exit(1);
    }
    mkdirSync(dirname(dest), { recursive: true });
    const content = readFileSync(src, 'utf8');
    writeFileSync(dest, applyReplacements(content));
  }
}

const webEnvTemplate = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=',
  'CLERK_SECRET_KEY=',
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL=http://localhost:3000/sign-up',
  '',
].join('\n');

const mobileEnvTemplate = ['EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=', ''].join('\n');

mkdirSync(mobileDir, { recursive: true });
mkdirSync(webDir, { recursive: true });
mkdirSync(moduleDir, { recursive: true });
mkdirSync(join(mobileDir, 'assets'), { recursive: true });
writeFileSync(join(mobileDir, 'assets', '.gitkeep'), '');

copyTemplateFiles(templateMobile, mobileDir, [
  '.eslintrc.cjs',
  'app.json',
  'app/_layout.tsx',
  'app/forgot-password.tsx',
  'app/index.tsx',
  'app/sign-in.tsx',
  'app/sign-up.tsx',
  'babel.config.js',
  'package.json',
  'tsconfig.json',
]);

copyTemplateFiles(templateWeb, webDir, [
  '.eslintrc.cjs',
  'app/forgot-password/page.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/sign-in/[[...sign-in]]/page.tsx',
  'app/sign-up/[[...sign-up]]/page.tsx',
  'app/sso-callback/[[...sso-callback]]/page.tsx',
  'proxy.ts',
  'next-env.d.ts',
  'next.config.ts',
  'package.json',
  'tsconfig.json',
]);

copyTemplateFiles(templateModule, moduleDir, [
  '.eslintrc.cjs',
  'package.json',
  'src/index.ts',
  'tsconfig.json',
]);

writeFileSync(join(webDir, '.env.local'), webEnvTemplate);
writeFileSync(join(webDir, '.env.local.example'), webEnvTemplate);
writeFileSync(join(mobileDir, '.env.local'), mobileEnvTemplate);
writeFileSync(join(mobileDir, '.env.local.example'), mobileEnvTemplate);

writeFileSync(
  join(root, 'tooling', 'PRODUCT_TEMPLATE.md'),
  [
    `Created product scaffold from eight-dd template.`,
    `Includes shared AppProviders in web/mobile layouts.`,
    `appSlug: ${appSlug}`,
    `moduleSlug: ${moduleSlug}`,
    `subdomain: ${subdomain}`,
    `webPort: ${webPort}`,
    `mobilePort: ${mobilePort}`,
    `envFiles: web(.env.local,.env.local.example), mobile(.env.local,.env.local.example)`,
    '',
  ].join('\n'),
);

console.log(
  `Created ${appSlug} from template (web:${webPort}, mobile:${mobilePort}, providers:on).`,
);
