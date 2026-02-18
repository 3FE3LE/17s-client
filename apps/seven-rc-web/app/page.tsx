'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { SevenReservationsClubFeatureFlags } from '@17suit/module-seven-reservations-club';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Seven Reservations Club Web" subtitle="Shared Tamagui UI running on web.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
      />
      <span>Flag: {SevenReservationsClubFeatureFlags.enableV2Flow}</span>
    </AppFrame>
  );
}
