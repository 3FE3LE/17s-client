# fifteen-ac-mobile — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/fifteen-ac-mobile/**` — everything under this directory is owned by this app.

## Neighbor apps

- `fifteen-ac-web` — same product, same module, same auth surface; coordinate UI changes that should mirror.

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/15ac-*` or `feat/fifteen-ac-*`. -->

- `feat/15ac-*`, `fix/15ac-*`

## Do not modify without confirmation

- `apps/fifteen-ac-mobile/app.json` — Expo project config (slug, bundle id, scheme).
- `apps/fifteen-ac-mobile/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.
- `17s-client/packages/modules/fifteen-all-check/**` — shared with `fifteen-ac-web`; coordinate cross-app.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)

## Related Context

- **Product agent: `.claude/agents/fifteen-ac.md`** — single source of truth for the fifteen-ac product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/fifteen-ac.md`** — non-derivable facts (Gmail OAuth owner, approved-sender business rule, candidate semantics).
- **Neighbor fence: `apps/fifteen-ac-web/AGENTS.md`** — same product, web conventions.
- **Registry entries: `apps-registry.json#apps.fifteen-ac-web` + `apps.fifteen-ac-mobile`**.
- **Module: `17s-client/packages/modules/fifteen-all-check`** — shared domain logic.
