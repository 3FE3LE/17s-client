'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { NineToNineNurseFeatureFlags } from '@17suit/module-nine-to-nine-nurse';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Nine To Nine Nurse Web" subtitle="Shared Tamagui UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {NineToNineNurseFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
