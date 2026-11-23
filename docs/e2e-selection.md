# Selective test selection in CI

CI runs only the tests a change can affect. Cost scales with what a PR touches, not with the size of the suite.

## What runs

| Event                                          | Unit and component tests                                   | E2E                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| PR into `development`                          | `vitest --changed origin/development` per affected package | Affected flows, plus smoke for apps touched through shared or unmapped code |
| PR into `preview` (promotion)                  | Same                                                       | Every spec of every app changed since the last release                      |
| PR into `production`                           | Same                                                       | Nothing new: it already passed in `preview`                                 |
| Push to `development`, `preview`, `production` | Full run of affected packages                              | None                                                                        |

A PR with no affected specs skips the E2E job and uses 0 Actions minutes.

Unit tests: the `quality` job in `ci.yml` passes `--changed <base> --passWithNoTests` to Vitest on pull requests. Vitest follows the import graph, including workspace packages (they export source, not `dist`). A change to a Vitest config or `package.json` reruns everything in that package.

## Declare a flow

Each app with E2E owns `apps/<app>/e2e/flows.json`:

```json
{
  "package": "@17suit/seven-rc-web",
  "smoke": ["e2e/public-smoke.spec.ts"],
  "global": ["packages/ui/**", "packages/core/**"],
  "flows": {
    "public-booking": {
      "specs": ["e2e/public-booking.spec.ts"],
      "paths": ["apps/seven-rc-web/app/c/**", "apps/seven-rc-web/lib/public-venue-api.ts"]
    }
  }
}
```

- `flows.<name>.paths`: files that can break that flow. A change here runs its `specs`.
- `global`: shared packages. A change here runs only the `smoke` specs (2 or 3 routes, about 30 s). Component correctness belongs to unit tests.
- Any other change under `apps/<app>/` runs `smoke`.
- Editing a spec runs that spec. Editing `flows.json`, `e2e/support/**` or `playwright.config.ts` runs the whole app suite.
- Changes to `pnpm-lock.yaml`, `.github/workflows/e2e.yml` or `tooling/scripts/select-e2e.mjs` run `smoke` for every app.

Rules enforced by the selector (it exits 1 otherwise):

- Every `*.spec.*` under `e2e/` is listed in `smoke` or in a flow. A new spec without an owner fails the `select` job.
- Every listed spec exists.

New feature checklist: add the spec, then add (or extend) its flow entry with the paths it depends on. If a path is missing, the flow does not run on the PR; the full run on the `preview` promotion catches it.

## Try it locally

```bash
node tooling/scripts/select-e2e.mjs --base origin/development --mode flows
node tooling/scripts/select-e2e.mjs --base origin/preview --mode full
node --test tooling/scripts/select-e2e.test.mjs
```

## Add a new app to E2E

Add `apps/<app>/e2e/flows.json`. The workflow matrix picks it up with no YAML change. The app's `playwright.config.ts` must start its own server (see `apps/seven-rc-web`) and need no secrets beyond the placeholders in `e2e.yml`.

## Cost controls

- Playwright browsers cached by `pnpm-lock.yaml` hash.
- `concurrency` cancels the previous run of the same PR.
- The E2E job does not start without affected specs.
- Reports upload only on failure, 7 days.
