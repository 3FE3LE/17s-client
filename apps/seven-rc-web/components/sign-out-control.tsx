'use client';

import { SignOutButton } from '@clerk/nextjs';
import { useTranslation } from '@17suit/i18n/react';

/**
 * `SignOutButton` requires exactly one element child (`Children.only`). An element
 * passed from a server component can reach the client as a lazy reference once
 * React outlines the payload (over 3200 bytes), which throws during SSR. The
 * button therefore has to be created here, on the client side of the boundary.
 */
export function SignOutControl({ className }: { className: string }) {
  const { t } = useTranslation('shell');
  return (
    <SignOutButton redirectUrl="/sign-in?redirect_url=/">
      <button type="button" className={className}>
        {t('footer.signOut')}
      </button>
    </SignOutButton>
  );
}
