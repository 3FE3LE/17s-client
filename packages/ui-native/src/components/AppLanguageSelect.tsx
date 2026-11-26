import { LOCALE_LABELS, SUPPORTED_LOCALES, isLocale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';

import { useLocale } from '../i18n/use-locale';
import { AppSelect } from './AppSelect';

/**
 * Language picker for product mobile apps. Options are endonyms
 * ("English", "Español"), never translated. Saves to secure-store.
 */
export function AppLanguageSelect() {
  const [locale, setLocale] = useLocale();
  const { t } = useTranslation('common');

  return (
    <AppSelect
      label={t('language.label')}
      value={locale}
      onChangeValue={(value) => {
        if (isLocale(value)) setLocale(value);
      }}
      options={SUPPORTED_LOCALES.map((code) => ({ value: code, label: LOCALE_LABELS[code] }))}
    />
  );
}
