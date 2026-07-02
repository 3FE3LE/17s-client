# nine-cc-web — Local Agent Directives

> Care coordination web dashboard for caregivers. NOT a medication reminder.
>
> Cross-cutting product truth lives in `.claude/agents/nine-cc.md`. Read this fence AFTER the product-level agent — the fence is surface-specific and inherits from it. Memory + registry live under the product-level agent.

## Own files

- `apps/nine-cc-web/**` — everything under this directory is owned by this app.

## Neighbor apps

- `nine-cc-mobile` — same product, same module, same auth surface; mirror UI changes that should reflect on both.
- `landing` — sign-in / sign-up / forgot-password flows land here first; the product app reuses the same Clerk auth bridge through `@17suit/core/auth/next`.

## Branch scope

- `feat/nine-cc-*`, `fix/nine-cc-*`, `chore/nine-cc-*`

## Do not modify without confirmation

- `apps/nine-cc-web/proxy.ts` — auth bridge; coordinate with auth-owner.
- `17s-client/packages/core/src/api-schema.ts` — generated; regenerate, don't hand-edit.
- `17s-client/packages/modules/nine-care-companion/**` — shared with `nine-cc-mobile`; coordinate cross-app.

## Conventions (web)

- Framework: Next.js App Router (16.x) with React 19.
- Auth: Clerk via `@17suit/core/auth/next` (`createNextClerkMiddleware` + `<WebAuthProvider>`). No custom auth.
- Styling: Tailwind v4 with the shared `@17suit/tailwind-config` (`globals.css` imports the suit tokens).
- Forms: `react-hook-form` + `zod` (schemas live in `@17suit/module-nine-care-companion`).
- Data: server components + actions for authoritative reads; React Query only when client-side cache helps. All med-status / care-circle data hits the backend through BFF route handlers (`app/api/nine-cc/**`), never directly.
- Testing: Vitest for unit, Playwright only if a screen needs end-to-end coverage.

## Local screen map (Day 1)

| Route | Role | Day-1 status |
|---|---|---|
| `/` | marketing home (signed-out) / care dashboard redirect (signed-in) | scaffolded |
| `/sign-in`, `/sign-up`, `/forgot-password`, `/sso-callback` | Clerk auth bridge | scaffolded |
| `/care-circle` | caregiver's primary care circle summary | not yet |
| `/patients/:id/daily-timeline` | daily medication block timeline | not yet |
| `/medication-blocks/:id/confirm` | confirmation form (taken/skipped/unknown) | not yet |

Care data routes are all behind auth; only the marketing + auth bridge surfaces are public.

## Do-not-build list

AI-generated medical decisions · fall detection · cameras · smartwatch integrations · IoT sensors · telemedicine · hospital integrations · FHIR / HL7 · billing · multi-patient per circle · EHR sync. The circle is intentionally one patient at a time (per product-level invariant).

## Sensitive data posture

Patient / caregiver PII + health-adjacent data. Default to **GDPR**. No PHI in logs. No third-party analytics on `/care-circle` or `/patients/**`. SSR responses default to no-cache for any path that shows patient health state.
