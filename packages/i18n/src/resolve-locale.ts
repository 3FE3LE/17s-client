import { DEFAULT_LOCALE, isLocale, normalizeLocale, type Locale } from './locales';
import type { I18nProfile } from './profiles';

export interface ResolveLocaleInput {
  profile: I18nProfile;
  /** Locale segment of the URL (marketing). `undefined` for the unprefixed default. */
  pathLocale?: string | null;
  /** Saved preference (cookie / secure-store). Product profile only. */
  saved?: string | null;
  /** Device or browser language tags, most preferred first. Product profile only. */
  detected?: readonly string[];
}

/**
 * Pure locale resolution.
 * - marketing: URL only. An unprefixed path or an unknown segment is the
 *   default locale; saved/detected inputs are ignored so static pages stay
 *   cache-safe.
 * - product: saved preference > first supported detected tag > default.
 */
export function resolveLocale({
  profile,
  pathLocale,
  saved,
  detected = [],
}: ResolveLocaleInput): Locale {
  if (profile === 'marketing') {
    return isLocale(pathLocale) ? pathLocale : DEFAULT_LOCALE;
  }
  if (isLocale(saved)) return saved;
  for (const tag of detected) {
    const locale = normalizeLocale(tag);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}
