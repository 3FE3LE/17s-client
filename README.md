# suite

Enterprise-grade multi-product monorepo for 17Suit, designed for scaling from day one to 10-20+ products with strict domain isolation and shared platform primitives.

## Stack

- Node `22.20.0` (mínimo `>=22.20.0`)
- `pnpm` workspaces (`10.30.0`)
- Turborepo
- TypeScript everywhere
- Next.js 16 for web surfaces
- Expo SDK 55 + React Native 0.83 for mobile surfaces
- Shared ESLint + TypeScript + Prettier configuration packages
- Husky + lint-staged pre-commit enforcement

## Workspace Structure

```text
apps/
  landing/                    # 17suit.com (marketing only)
  admin/                         # admin.17suit.com
  seven-rc-web/           # seven-rc.17suit.com
  seven-rc-mobile/
  six-sp-web/               # sixsense.17suit.com
  six-sp-mobile/
  five-bg-web/                # barber.17suit.com
  five-bg-mobile/
  nine-nr-web/            # nurse.17suit.com
  nine-nr-mobile/
  two-sb-web/                # split.17suit.com
  two-sb-mobile/
  one-pt-web/                 # travel.17suit.com
  one-pt-mobile/
  four-yc-web/               # closet.17suit.com
  four-yc-mobile/
  eight-dd-web/            # dishes.17suit.com
  eight-dd-mobile/

packages/
  core/                              # API client, auth, env, logging, analytics, flags
  ui/                                # cross-platform UI primitives (web/native conditional exports)
  modules/
    seven-reservations-club/
    six-sense-proof/
    five-barber-go/
    nine-to-nine-nurse/
    two-split-bill/
    one-plan-trip/
    four-you-closet/
    eight-dream-dishes/
  typescript-config/                 # shared TS configs
  eslint-config/                     # shared ESLint configs
  tailwind-config/                   # shared Tailwind baseline (optional per app)

tooling/
  generators/create-product.mjs      # rapid product bootstrap
  monorepo-tools/                    # workspace entrypoint for generators
```

## Routing Strategy

- Marketing pages: `17suit.com` and `17suit.com/<product-slug>`
- Product web apps: `<product>.17suit.com`
- Admin app: `admin.17suit.com`

Marketing and product surfaces are intentionally separated to avoid coupling release lifecycles and runtime concerns.

## Package Philosophy

- `packages/core` contains horizontal platform concerns used by all apps.
- `packages/modules/<product>` owns each product domain model, validators, and domain feature-flag keys.
- `packages/ui` centralizes shared design primitives across Next.js and Expo apps.
- Apps are thin composition layers that wire UI + platform + domain packages.

### Domain Isolation Rules

- Product apps import only:
  - `@17suit/core`
  - `@17suit/ui`
  - their own `@17suit/module-<product>` package
- No product module depends on another product module.
- Shared logic moves to `core` or `ui`, never copied between apps.

## Environment Strategy

Use app-level `.env` files with shared keys:

- `APP_ENV=local|staging|production`
- `API_BASE_URL=...`
- `FEATURE_FLAG_PROVIDER=memory|launchdarkly|...`

Examples are provided:

- `.env.example`
- `.env.staging.example`
- `.env.production.example`

## pnpm 10 Notes

- This repo is pinned to `pnpm@10.30.0` via `packageManager` in root `package.json`.
- pnpm 10 blocks dependency lifecycle scripts by default unless explicitly allowed.
- Allowed native build dependencies are declared in `pnpm-workspace.yaml` under `onlyBuiltDependencies`:
  - `@swc/core`
  - `esbuild`
  - `sharp`
  - `unrs-resolver`

## Upgrade Notes (Current Baseline)

- Web apps use Next.js 16 (including `proxy.ts` convention replacing deprecated `middleware.ts`).
- Mobile apps use Expo SDK 55 and React Native 0.83 (New Architecture always on in RN 0.82+).

## Turborepo Pipeline

`turbo.json` defines package-level tasks for cacheable parallel execution:

- `build` depends on `^build` and caches outputs
- `lint` and `typecheck` run across graph
- `dev` is persistent and uncached

In CI, changed-package runs are enabled with:

- `pnpm turbo run lint typecheck --affected`
- `pnpm turbo run build --affected`

## Runbook

1. Install dependencies:

```bash
pnpm install
```

2. Run everything in parallel:

```bash
pnpm dev
```

2.5. Run only one product (web + mobile tunnel) with Turbo filters:

```bash
pnpm run dev:product --product=seven-rc
# or
pnpm run dev:product --seven-rc
```

3. Run a single app:

```bash
pnpm --filter @17suit/landing dev
pnpm --filter @17suit/admin dev
pnpm --filter @17suit/seven-rc-web dev
pnpm --filter @17suit/seven-rc-mobile dev
```

### Mobile

- `pnpm --filter @17suit/two-sb-mobile dev` starts Expo (standard mode).

4. Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Adding a New Product

1. Create base directories:

```bash
pnpm --filter @17suit/tooling product:new <product-slug> <subdomain>
```

2. Clone an existing trio and adapt it:

- `apps/<product>-web`
- `apps/<product>-mobile`
- `packages/modules/<product>`

3. Update:

- app package names
- module package name (`@17suit/module-<product>`)
- domain schemas/services/validators
- DNS/subdomain + deployment project mapping
- marketing route entry in `apps/landing`

4. Deploy only affected packages/apps via Turborepo in CI.

## Notes for Productionization

This scaffold is intentionally enterprise-oriented and ready for further hardening:

- plug in real auth provider in `packages/core`
- wire external feature-flag provider in `packages/core`
- add observability exporters in `packages/core/logger`
- add integration/unit test layers per package/app
- map each app to isolated deployment targets
