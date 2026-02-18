'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { OnePlanTripFeatureFlags } from '@17suit/module-one-plan-trip';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="One Plan Trip Web" subtitle="Shared Tamagui UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {OnePlanTripFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
