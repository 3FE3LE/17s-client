'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { SixSenseProofFeatureFlags } from '@17suit/module-six-sense-proof';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Six Sense Proof Web" subtitle="Shared UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {SixSenseProofFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
