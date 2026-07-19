import { useClerk, useUser } from '@clerk/clerk-expo';
import { AppFrame, AppProfile } from '@17suit/ui';

export default function IndexScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Sixteen Pixel Perfect" subtitle="UI compartida desde @17suit/ui">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut()}
      />
    </AppFrame>
  );
}
