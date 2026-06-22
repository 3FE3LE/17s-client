# Product template (single source of truth)

Canonical scaffold for a new 17Suit web app. `app-web/` holds the homogeneous
baseline every `apps/*-web` must match (configs, styles, auth shell, deploy).

## Web baseline files (`app-web/`)

| File                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `package.json`       | scripts + deps (Next 16, React 19, Tailwind v4, Clerk)    |
| `layout.tsx`         | `WebAuthProvider` + `AppProviders` + `AppProductFooter`   |
| `globals.css`        | Tailwind + `@17suit/tailwind-config/theme.css` tokens     |
| `postcss.config.mjs` | `@tailwindcss/postcss`                                    |
| `next.config.ts`     | `transpilePackages` + `react-native` → `react-native-web` |
| `tsconfig.json`      | extends `@17suit/typescript-config/nextjs` + `@/*` path   |
| `proxy.ts`           | `createNextClerkMiddleware` (NOT raw `clerkMiddleware`)   |
| `vercel.mjs`         | `createAppVercelConfig('<slug>-web')`                     |
| `.eslintrc.cjs`      | extends `@17suit/eslint-config/next`                      |

## Placeholders

| Token         | Example                               |
| ------------- | ------------------------------------- |
| `__SLUG__`    | `seven-rc`                            |
| `__MODULE__`  | `module-seven-reservations-club`      |
| `__TITLE__`   | `Seven Reservations Club`             |
| `__TAGLINE__` | `Reservas y operacion para complejos` |
| `__PORT__`    | unique dev port (see ports table)     |

## New product steps

1. Copy `app-web/` to `apps/<slug>-web`, replace all `__TOKEN__`.
2. Copy an existing `*-mobile` + `packages/modules/*` for the domain module.
3. Update package names (`@17suit/module-...`), display names, subdomains.
4. Define domain schema + service functions in the module package.

## Homogeneity checklist (apply to every existing `*-web`)

- [ ] `globals.css` includes `margin:0; padding:0; min-height:100%`.
- [ ] `layout.tsx` wraps with `WebAuthProvider` + `AppProviders`, `lang="es"`.
- [ ] `tsconfig.json` has `@/*` path + `exclude: ["node_modules"]`.
- [ ] `proxy.ts` uses `createNextClerkMiddleware` (auth-bridge routes public).
- [ ] `vercel.mjs` present and points to the app slug.
- [ ] `package.json` has `dev:product` script + Tailwind devDeps.

## Dev port allocation

| App             | Port |
| --------------- | ---- |
| landing         | 3000 |
| fourteen-cp-web | 3003 |
| seven-rc-web    | 3007 |
| admin           | 3018 |

New apps: pick the next free port and add it here.
