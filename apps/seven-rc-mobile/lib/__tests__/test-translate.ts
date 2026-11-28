import { createI18n } from '@17suit/i18n';
import { sevenRcResources } from '@17suit/module-seven-reservations-club/i18n';

/** Spanish translator for the `mobile` namespace. */
export const tEs = createI18n({ locale: 'es', resources: sevenRcResources }).getFixedT(
  'es',
  'mobile',
);

/** English translator, to prove the helpers follow the locale. */
export const tEn = createI18n({ locale: 'en', resources: sevenRcResources }).getFixedT(
  'en',
  'mobile',
);
