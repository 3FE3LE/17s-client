'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { TwoSplitBillFeatureFlags } from '@17suit/module-two-split-bill';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Two Split Bill Web" subtitle="Shared UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {TwoSplitBillFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
