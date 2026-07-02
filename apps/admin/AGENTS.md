# admin — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/admin/**` — everything under this directory is owned by this app.

## Neighbor apps

<!-- TODO: list apps that share a module, share a database table, or share an auth surface -->

- (none)

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/<slug>-...`, `fix/<slug>-...`. -->

- `feat/admin-*`, `fix/admin-*`

## Do not modify without confirmation

- `apps/admin/proxy.ts` — auth bridge; coordinate with auth-owner.
- `apps/admin/vercel.mjs` — Vercel project wiring.
- `apps/admin/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)

## Related Context

- **Product agent: `.claude/agents/admin.md`** — single source of truth for the admin product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/admin.md`** — non-derivable facts (owners, third-party contacts, business rationale).
- **Registry entry: `apps-registry.json#apps.admin`**.
- **Neighbor apps: (none — admin is web-only on Day 1).**
