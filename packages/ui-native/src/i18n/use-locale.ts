import type { Locale } from '@17suit/i18n';
import { useSyncExternalStore } from 'react';

import { getLocale, setLocale, subscribeLocale } from './locale-store';

/** Current UI locale and a setter that persists the choice. */
export function useLocale(): readonly [Locale, (next: Locale) => void] {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, getLocale);
  return [locale, setLocale] as const;
}
