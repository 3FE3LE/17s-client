# Fifteen All Check

Fifteen All Check is the finance cockpit product added under the existing 17Suit client monorepo.

## What Was Added

- Web app: `apps/fifteen-ac-web`
- Mobile scaffold: `apps/fifteen-ac-mobile`
- Product module: `packages/modules/fifteen-all-check`
- Landing registration: `apps/landing/app/page.tsx` and `apps/landing/app/[slug]/page.tsx`

The chosen suite name is `Fifteen All Check` because numbers 1, 2, 4, 5, 6, 7, 8, and 9 already exist in code, 11 is reserved in the roadmap for Eleven Event Heaven, and 14 was available.

## Run

```bash
cd 17s-client
pnpm install
pnpm --filter @17suit/fifteen-ac-web dev
```

The web app runs on port `3015`.

Required local env:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `API_BASE_URL`
- `FIFTEEN_AC_WEB_URL` on the server, recommended as `http://localhost:3015`

## Current Screens

- `/` dashboard
- `/transactions`
- `/review`
- `/cards`
- `/accounts`
- `/income`
- `/fixed-obligations`
- `/subscriptions`
- `/settings/email-sources`
- `/settings/categories`

The app uses the existing Next.js, Clerk, Tailwind v4, `@17suit/ui`, and BFF proxy conventions.

## Real Data Behavior

- Outlook OAuth and webhook flows are backend skeletons only.
- Gmail OAuth and manual recent-message sync are implemented on the backend.
- Gmail messages are stored as raw evidence and parsed into review candidates when possible.
- Confirmed transactions are created only when a user accepts a candidate from `/review`.
- No PDF, bank, or payment provider data is processed.
- No finance records are created automatically; empty screens mean no real synced or accepted records exist yet.

## Gmail Flow

`/settings/email-sources` exposes two server-action forms:

- `Connect Google`: starts Google OAuth through the backend.
- `Sync recent`: fetches recent Gmail metadata, stores it as `FinanceRawEmail`, and creates review candidates for parseable finance emails.

The page does not use client-side effects or a global state store.
