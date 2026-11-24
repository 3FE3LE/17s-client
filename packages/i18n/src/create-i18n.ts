import { createInstance, type i18n as I18nInstance } from 'i18next';

import { sharedResources, SHARED_NAMESPACES } from './catalogs';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './locales';
import type { Resources } from './types';

export interface CreateI18nOptions {
  locale: Locale;
  /** Per-product catalogs, merged over the shared ones: `{ en: { reservations: {...} } }`. */
  resources?: Partial<Record<Locale, Record<string, object>>>;
}

/**
 * Builds an isolated i18next instance (one per request on the server, one per
 * app on the client). Synchronous: resources are bundled, no backend loader.
 */
export function createI18n({ locale, resources = {} }: CreateI18nOptions): I18nInstance {
  const merged: Resources = {};
  for (const lng of SUPPORTED_LOCALES) {
    merged[lng] = { ...sharedResources[lng], ...resources[lng] };
  }

  const instance = createInstance();
  void instance.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    ns: [...SHARED_NAMESPACES, ...Object.keys(resources[DEFAULT_LOCALE] ?? {})],
    defaultNS: 'common',
    resources: merged,
    initAsync: false,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  return instance;
}
