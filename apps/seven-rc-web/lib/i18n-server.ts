import {
  sevenRcResources,
  type SevenRcNamespace,
} from '@17suit/module-seven-reservations-club/i18n';
import { createI18n } from '@17suit/i18n';
import { getProductLocale } from '@17suit/i18n/next';

/** Translator for server components: `const t = await getServerT('owner');`. */
export async function getServerT(ns: SevenRcNamespace) {
  const locale = await getProductLocale();
  const i18n = createI18n({ locale, resources: sevenRcResources });
  return { t: i18n.getFixedT(locale, ns), locale };
}
