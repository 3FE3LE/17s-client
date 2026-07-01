# landing — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/landing/**` — everything under this directory is owned by this app.

## Neighbor apps

<!-- TODO: list apps that share a module, share a database table, or share an auth surface -->

- (none)

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/<slug>-...`, `fix/<slug>-...`. -->

- `feat/landing-*`, `fix/landing-*`

## Do not modify without confirmation

- `apps/landing/proxy.ts` — auth bridge; coordinate with auth-owner.
- `apps/landing/vercel.mjs` — Vercel project wiring.
- `apps/landing/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)

## Related Context

- **Product agent: `.claude/agents/landing.md`** — single source of truth for the landing product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/landing.md`** — non-derivable facts (marketing owner, copy decisions, SEO context).
- **Registry entry: `apps-registry.json#apps.landing`**.
- **Neighbor apps: (none — landing is web-only on Day 1).**
