# fifteen-ac-web — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/fifteen-ac-web/**` — everything under this directory is owned by this app.

## Neighbor apps

- `fifteen-ac-mobile` — same product, same module, same auth surface; coordinate UI changes that should mirror.

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/15ac-*` or `feat/fifteen-ac-*`. -->

- `feat/15ac-*`, `fix/15ac-*`

## Do not modify without confirmation

- `apps/fifteen-ac-web/proxy.ts` — auth bridge; coordinate with auth-owner.
- `apps/fifteen-ac-web/vercel.mjs` — Vercel project wiring.
- `apps/fifteen-ac-web/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.
- `17s-client/packages/modules/fifteen-all-check/**` — shared with `fifteen-ac-mobile`; coordinate cross-app.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)

## Related Context

- **Product agent: `.claude/agents/fifteen-ac.md`** — single source of truth for the fifteen-ac product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/fifteen-ac.md`** — non-derivable facts (Gmail OAuth owner, approved-sender business rule, candidate semantics).
- **Neighbor fence: `apps/fifteen-ac-mobile/AGENTS.md`** — same product, mobile conventions.
- **Registry entries: `apps-registry.json#apps.fifteen-ac-web` + `apps.fifteen-ac-mobile`**.
- **Module: `17s-client/packages/modules/fifteen-all-check`** — shared domain logic.
