'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { FiveBarberGoFeatureFlags } from '@17suit/module-five-barber-go';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Five Barber Go Web" subtitle="Shared UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {FiveBarberGoFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
