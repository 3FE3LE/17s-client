/**
 * Locale contract shared by every 17s app (web and native).
 * `en` is the default and the source of truth for catalogs.
 */
export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Web cookie holding the saved preference (product profile, marketing account area). */
export const LOCALE_COOKIE = 'suit-locale';
/** Secure-store / localStorage key for the saved preference. */
export const LOCALE_STORAGE_KEY = 'suit-locale';

/** Endonyms: each language is shown in its own language, never translated. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Maps a BCP 47 tag (`es-MX`, `EN_us`) to a supported locale, or `null`.
 */
export function normalizeLocale(tag: string | null | undefined): Locale | null {
  if (!tag) return null;
  const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(primary) ? primary : null;
}

/**
 * Parses an `Accept-Language` header into locale tags ordered by quality.
 * Tags with `q=0` are dropped.
 */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim(), quality: Number.isNaN(quality) ? 0 : quality, index };
    })
    .filter((entry) => entry.tag.length > 0 && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map((entry) => entry.tag);
}
