import { createI18n } from '@17suit/i18n';
import { sevenRcResources } from '@17suit/module-seven-reservations-club/i18n';
import type { Translate } from '@/lib/seven-rc-format';

/** Spanish translator for specs of the formatting helpers. */
export const tEs = createI18n({ locale: 'es', resources: sevenRcResources }).getFixedT(
  'es',
  'format',
) as unknown as Translate;

/** English translator, to prove the helpers follow the locale. */
export const tEn = createI18n({ locale: 'en', resources: sevenRcResources }).getFixedT(
  'en',
  'format',
) as unknown as Translate;
