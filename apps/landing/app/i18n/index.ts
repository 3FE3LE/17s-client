import { createI18n, type Locale } from '@17suit/i18n';
import { landing as en } from './en';
import { landing as es } from './es';

export const landingResources = {
  en: { landing: en },
  es: { landing: es },
} as const;

/** Server-side translator for the `landing` namespace; one isolated instance per call. */
export function getT(locale: Locale) {
  return createI18n({ locale, resources: landingResources }).getFixedT(locale, 'landing');
}

export type LandingT = ReturnType<typeof getT>;

/** Any translator that accepts `returnObjects` (server `getT` or react-i18next `t`). */
type AnyT = (key: string, options: { returnObjects: true }) => unknown;

/** Reads an array of strings from the catalog (`returnObjects`). */
export function tList(t: AnyT, key: string): string[] {
  return t(key, { returnObjects: true }) as string[];
}

/** Reads an array of objects from the catalog (`returnObjects`). */
export function tItems<T>(t: AnyT, key: string): T[] {
  return t(key, { returnObjects: true }) as T[];
}
