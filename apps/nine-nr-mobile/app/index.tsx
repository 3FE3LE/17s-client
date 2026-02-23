import { useClerk, useUser } from '@clerk/clerk-expo';
import { NineToNineNurseFeatureFlags } from '@17suit/module-nine-to-nine-nurse';
import { AppFrame, AppProfile, suitTheme } from '@17suit/ui';
import { Text } from 'react-native';

export default function IndexScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Nine To Nine Nurse" subtitle="Shared UI running on mobile.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut()}
      />
      <Text style={{ color: suitTheme.colors.muted }}>
        Flag: {NineToNineNurseFeatureFlags.enableV2Flow}
      </Text>
    </AppFrame>
  );
}
