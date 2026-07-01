# seven-rc-web — Local Agent Directives

> Auto-generated stub. Owner fills in TODO sections within first session.

## Own files

- `apps/seven-rc-web/**` — everything under this directory is owned by this app.

## Neighbor apps

- `seven-rc-mobile` — same product, same module, same auth surface; coordinate UI changes that should mirror.

## Branch scope

<!-- TODO: which feature branches target this app. Convention: `feat/7rc-*` or `feat/seven-rc-*`. -->

- `feat/7rc-*`, `fix/7rc-*`

## Do not modify without confirmation

- `apps/seven-rc-web/proxy.ts` — auth bridge; coordinate with auth-owner.
- `apps/seven-rc-web/vercel.mjs` — Vercel project wiring.
- `apps/seven-rc-web/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.
- `17s-client/packages/modules/seven-reservations-club/**` — shared with `seven-rc-mobile`; coordinate cross-app.

## Local conventions

<!-- TODO: state mgmt, form lib, validation lib, query lib, test framework -->

- (placeholder)
