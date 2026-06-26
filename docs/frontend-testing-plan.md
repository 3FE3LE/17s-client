# Frontend Testing Plan

## Current Gap

The client workspace currently has no frontend test runner wired into package scripts. Existing quality gates are `lint`, `typecheck`, `lint:styles`, and `build`.

## First Test Layer To Add

Start with component/unit tests before browser E2E:

- Shared UI: `@17suit/ui`, `@17suit/ui-web`, `@17suit/ui-native`
- Product modules: validators, formatters, query helpers, pure domain functions
- Auth routing helpers: redirect target sanitization and public route config

Recommended initial tooling:

- Web packages/apps: Vitest + React Testing Library
- Expo apps: Jest Expo + React Native Testing Library
- E2E later: Playwright for web app smoke flows

## Minimum Coverage Targets

Add tests first where regressions currently hurt deploys or onboarding:

- Landing auth pages: sign-in/sign-up/forgot-password redirect sanitization
- `seven-rc-mobile`: role routing, reservation payload building, form validation
- `fifteen-ac-web`: email source discovery params, toast/error rendering, BFF response handling
- `@17suit/ui`: button/input/select shell rendering and disabled/error states

## Package Script Shape

When a test runner is added, each tested package should expose:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Mobile apps can use:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Then wire Turbo with a cacheable `test` task and run targeted tests in CI before broad E2E.

## Guardrails

- Keep tests next to the feature they protect.
- Prefer pure helper tests before full screen rendering when behavior can be isolated.
- Do not make tests depend on live Clerk, backend, Gmail, or Expo native runtime.
- Mock network boundaries at the package/app edge.
