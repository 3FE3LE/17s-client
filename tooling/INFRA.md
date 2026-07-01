# Infrastructure Conventions

Per-app conventions that affect the runtime + tooling. Anchored here so a new product or a new contributor can pick them up by reading one file.

## Dev ports

Convention: the dev server port of an app equals `3000 + <product-number>` for web and `8000 + <product-number>` for mobile (React Native / Expo). Product number is the single-digit prefix on the slug.

| Product             | Slug      | Web port | Mobile port |
| ------------------- | --------- | -------- | ----------- |
| Landing             | `landing` | 3000     | —           |
| Admin               | `admin`   | 3018     | —           |
| Nine Care Companion | `nine-cc` | 3009     | 8089        |

Numbers are not strictly sequential — `landing` got 3000 historically; later apps picked non-conflicting slots around the canonical `3000 + N` formula. The formula still applies for new apps:

- New product `fourteen-cp` → web `3014`, mobile `8814`.
- New product `ten-fc` → web `3010`, mobile `8810`.

### Why a fixed formula

- Easy mnemonic when running multiple apps on the same host (you know `8089` is the 9th).
- Avoids confusion when a colleague runs the same app locally — same port, same `/etc/hosts` mapping, same Vercel preview URL pattern.
- Vercel preview URLs encode the per-app port (browser-side debug capture uses it as the suffix).

### Where the convention lives in tooling

- **`tooling/generators/create-product.mjs`** — accepts an explicit `--web-port` and `--mobile-port` so a future scaffold can pin the formula-derived value rather than relying on `nextFreePort()` round-robin allocation. Defaults to `nextFreePort(3001, used)` and `nextFreePort(8081, used)`, which means without an explicit flag the generator picks the lowest free port. Use the flag when scaffolding an app whose product number already has a fixed slot.
- **`apps-registry.json`** — `devPort` is the canonical record. Always set it to the formula-derived value when creating the registry entry. The check-registry CI gate does not currently enforce the formula; flag a follow-up PR if you'd like to add that.

### Overrides for non-standard ports

A small set of apps keep legacy ports that don't follow the formula (e.g. `admin` lands on 3018). Do **not** retroactively renumber — DNS, bookmarks, and `package.json#scripts.dev` references all already point at the legacy port. Document the deviation rather than fix.

## Env files

- `.env.local` is gitignored. Each developer populates their own with values from 1Password.
- `.env.local.example` is committed. Add a key to `.env.local.example` the moment it becomes part of the app contract.
- `EXPO_PUBLIC_*` keys are inlined into the bundle at build time. Treat them as public; never put a secret there.

## Future additions

- Local Postgres bootstrap command + container lifecycle (`./dev.sh --local-db` already covers this — moved here for completeness).
- Sentry DSN rotation cadence.
- Twilio A2P 10DLC registration owner.
