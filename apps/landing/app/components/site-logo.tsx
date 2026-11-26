import type { Locale } from '@17suit/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '../i18n';
import { localePath } from '../lib/locale-path';

/** Logo link to home. Server-safe: the account area passes its cookie locale. */
export function SiteLogo({ locale }: { locale: Locale }) {
  const t = getT(locale);
  return (
    <Link
      href={localePath(locale, '/')}
      className="inline-flex min-h-11 shrink-0 items-center rounded-md no-underline"
    >
      <Image
        src="/logo-17suit@4x.svg"
        alt={t('nav.logoAlt')}
        width={196}
        height={62}
        className="h-[32px] w-auto md:h-[40px] dark:brightness-0 dark:invert"
        priority
      />
    </Link>
  );
}
