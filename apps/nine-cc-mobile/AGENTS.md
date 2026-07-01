# nine-cc-mobile — Local Agent Directives

> Scaffolded by manual `sed` substitution from `apps/fifteen-ac-mobile/`. Owner fills in TODO sections.

## Own files

- `apps/nine-cc-mobile/**` — everything under this directory is owned by this app.

## Neighbor apps

- `nine-cc-web` — same product, same module, same auth surface; coordinate UI changes that should mirror the web dashboard.

## Branch scope

- `feat/9cc-*`, `fix/9cc-*` — branches targeting nine-cc-mobile (shared namespace with nine-cc-web; coordinate with the web owner before splitting).
- Branches off `development` (per the 3-tier release workflow in `AGENTS.md`).

## Do not modify without confirmation

- `apps/nine-cc-mobile/app.json` — Expo project config (slug, bundle id, scheme). Bundle id is shared with future store listings; coordinate with release-owner.
- `apps/nine-cc-mobile/babel.config.js` — module-resolver + reanimated plugin order; touching this breaks runtime.
- `apps/nine-cc-mobile/pnpm-lock.yaml` — only via `pnpm install` in this app dir.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate via `pnpm --filter @17suit/core gen:api-schema`, don't hand-edit.
- `17s-client/packages/modules/nine-care-companion/**` — shared domain logic with the web app, the Alexa skill (future), and any other surface.

## Cross-cutting invariants (carry into every change)

Mirrors of `.claude/agents/nine-cc-web.md` and the per-agent `nine-cc` invariants:

- **Backend = source of truth.** Mobile reads and writes go through the backend. No offline-first state derivation here.
- **Medication responses deterministic.** No LLM in the factual med-status request path.
- **Alexa never decides medical state.** Mobile mirrors backend state for caregivers. Patient uses Alexa voice (out of mobile's scope).
- **Every missed critical medication escalates.** Per-care-circle configuration decides recipients and cadence.
- **Privacy > convenience.** Defaults favor minimal data exposure. Push notifications NEVER include raw medication state in the payload — only summary counts ("3 of 5 confirmed").

## Mobile-specific conventions

- routing: `expo-router` (file-based under `app/`).
- auth: `@clerk/clerk-expo`.
- styling: `@17suit/ui` + `@17suit/ui-native` primitives.
- state: server actions + React Query where client cache helps.
- observability: `@sentry/react-native`.
- icons: `@expo/vector-icons`.

## Day-1 mobile posture

The product spec lists the patient interface as **Alexa voice**, not mobile. This Expo scaffold exists so the caregiver side can ship a mobile experience **later**, possibly pivoting to a PWA depending on analytics. Day 1 features that should land in mobile are the caregiver-facing ones (Care Circle membership, view-only dashboard, push to confirm med block), not the patient-facing ones.

Mobile is functionally web-only-on-mobile until Day-2 product roadmap confirms the pivot.

## Open (not blocking Day 1)

- Apple Push Notification service key holder.
- Android Adaptive Icons deliverable.
- Caregiver mobile-only features (offline read cache of the daily timeline).
- Server-side feature flags for mobile-disabled surfaces (the right answer per-team once usage data arrives).
