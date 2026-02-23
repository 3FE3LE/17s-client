'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { FourYouClosetFeatureFlags } from '@17suit/module-four-you-closet';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Four You Closet Web" subtitle="Shared UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {FourYouClosetFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
