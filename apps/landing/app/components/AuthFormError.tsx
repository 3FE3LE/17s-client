import { useTranslation } from '@17suit/i18n/react';
import Link from 'next/link';
import { needsContactLink } from '../lib/clerk-errors';
import { localePath } from '../lib/locale-path';
import { useUiLocale } from './use-ui-locale';

interface AuthFormErrorProps {
  message: string | null;
  /** Referenced by the invalid input's `aria-describedby`. */
  id?: string;
}

export function AuthFormError({ message, id }: AuthFormErrorProps) {
  const { t } = useTranslation('landing');
  const locale = useUiLocale();

  if (!message) {
    return null;
  }

  return (
    <div id={id} role="alert" aria-live="polite" className="grid gap-[2px]">
      <p className="m-0 text-sm leading-[18px] text-destructive">{message}</p>
      {needsContactLink(message, t) ? (
        <Link
          href={localePath(locale, '/contact')}
          className="inline-flex min-h-11 w-fit items-center text-sm font-bold leading-[18px] text-text underline underline-offset-4"
        >
          {t('account.errors.contactLink')}
        </Link>
      ) : null}
    </div>
  );
}
