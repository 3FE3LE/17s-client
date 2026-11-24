/**
 * Surface profile, declared per app as `i18nProfile` in `apps-registry.json`.
 *
 * - `marketing`: locale lives in the URL (`/` = en, `/es` = es). Static
 *   rendering; never read cookies or headers in these routes.
 * - `product`: no URL prefix. Saved preference > device/browser > default.
 */
export const I18N_PROFILES = ['marketing', 'product'] as const;
export type I18nProfile = (typeof I18N_PROFILES)[number];

export function isI18nProfile(value: unknown): value is I18nProfile {
  return typeof value === 'string' && (I18N_PROFILES as readonly string[]).includes(value);
}
