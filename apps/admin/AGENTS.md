# admin — Local Agent Directives

> Admin = "Consola de operación", the internal console for 17Suit operators. Product contract: `/home/fl/17s-workspace/.claude/agents/admin.md`.

## Own files

- `apps/admin/**` — everything under this directory is owned by this app.

## Neighbor apps

<!-- TODO: list apps that share a module, share a database table, or share an auth surface -->

- (none)

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/<slug>-...`, `fix/<slug>-...`. -->

- `feat/admin-*`, `fix/admin-*`

## Do not modify without confirmation

- `apps/admin/proxy.ts` — Clerk auth (merged, user-approved); coordinate with auth-owner before changing public routes.
- `apps/admin/vercel.mjs` — Vercel project wiring.
- `apps/admin/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.

## Auth and access

- Auth gating is on. `proxy.ts` (Clerk) requires a session on every route except the auth bridges (`/sign-in`, `/forgot-password`, `/sso-callback`), which forward to the landing sign-in.
- Operator allowlist, deny by default: `app/(console)/layout.tsx` + `lib/operator-access.ts`. A user enters only if a **verified** Clerk email is in the server-only `ADMIN_ALLOWED_EMAILS` (comma-separated, case-insensitive). Unset or empty denies everyone; in development the 403 view explains that the variable is missing.
- Every console page re-checks access before rendering, because a page's RSC payload can be fetched without its layout.

## Screen map

| Route                  | File                                                            | State                                                                    |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/` Resumen            | `app/(console)/page.tsx` → `components/overview.tsx`            | Products table (registry snapshot in `lib/products.ts`) + console status |
| `/tenants`             | `app/(console)/tenants/page.tsx`                                | Not available yet (`SectionPending`)                                     |
| `/feature-flags`       | `app/(console)/feature-flags/page.tsx`                          | Not available yet                                                        |
| `/billing` Facturación | `app/(console)/billing/page.tsx`                                | Not available yet                                                        |
| `/analytics` Analítica | `app/(console)/analytics/page.tsx`                              | Not available yet                                                        |
| 403                    | `components/access-denied.tsx` (rendered by the console layout) | Signed in but not on the allowlist                                       |
| errors / loading       | `app/(console)/error.tsx`, `app/(console)/loading.tsx`          | Spanish `AppAlert` + retry, `AppSkeleton`                                |
| 404                    | `app/not-found.tsx`                                             | Spanish, link to Resumen                                                 |

Shell: `components/admin-shell.tsx` wraps `AppWorkspaceShell` and adds a context bar with the environment badge (Producción / Preview / Desarrollo, from `VERCEL_ENV` then `NODE_ENV`) and the operator email. Nav and section copy: `lib/sections.ts`.

## Local conventions

- Pages are RSC. `AppEmpty`, `AppAlert`, `AppBadge` and `AppSkeleton` read the theme through a client hook, so render them from `'use client'` components.
- No fake data: sections without a backend use `SectionPending`.
- Spanish copy. Only "Tenants" and "Feature flags" stay in English.
- Light theme only (`app/globals.css`, `AppProviders themeMode="light"`).
- No `useEffect`.
- Env vars: see `.env.example` (`ADMIN_ALLOWED_EMAILS` is server-only; never prefix it with `NEXT_PUBLIC_`).

## Related Context

- **Product agent: `.claude/agents/admin.md`** — single source of truth for the admin product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/admin.md`** — non-derivable facts (owners, third-party contacts, business rationale).
- **Registry entry: `apps-registry.json#apps.admin`**.
- **Neighbor apps: (none — admin is web-only).**
