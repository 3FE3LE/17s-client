# seven-rc-mobile — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/seven-rc-mobile/**` — everything under this directory is owned by this app.

## Neighbor apps

- `seven-rc-web` — same product, same module, same auth surface; coordinate UI changes that should mirror.

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/7rc-*` or `feat/seven-rc-*`. -->

- `feat/7rc-*`, `fix/7rc-*`

## Do not modify without confirmation

- `apps/seven-rc-mobile/app.json` — Expo project config (slug, bundle id, scheme).
- `apps/seven-rc-mobile/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.
- `17s-client/packages/modules/seven-reservations-club/**` — shared with `seven-rc-web`; coordinate cross-app.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)

## Related Context

- **Product agent: `.claude/agents/seven-rc.md`** — single source of truth for the seven-rc product (philosophy, invariants, conventions). Read first for cross-cutting product concerns.
- **Memory: `/home/fl/.claude/projects/-home-fl-17s-workspace/memory/project/seven-rc.md`** — non-derivable facts (reservation flow rules, deposit logic, role selection meaning).
- **Neighbor fence: `apps/seven-rc-web/AGENTS.md`** — same product, web conventions.
- **Registry entries: `apps-registry.json#apps.seven-rc-web` + `apps.seven-rc-mobile`**.
- **Module: `17s-client/packages/modules/seven-reservations-club`** — shared domain logic.
