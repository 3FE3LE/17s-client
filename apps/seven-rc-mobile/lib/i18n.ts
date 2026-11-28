import type { useTranslation } from '@17suit/i18n/react';

/** Translator for the `mobile` namespace; non-component helpers receive it as a parameter. */
export type MobileT = ReturnType<typeof useTranslation<'mobile'>>['t'];
