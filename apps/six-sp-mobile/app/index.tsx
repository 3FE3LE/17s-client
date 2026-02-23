import { useClerk, useUser } from '@clerk/clerk-expo';
import { SixSenseProofFeatureFlags } from '@17suit/module-six-sense-proof';
import { AppFrame, AppProfile, suitTheme } from '@17suit/ui';
import { Text } from 'react-native';

export default function IndexScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Six Sense Proof" subtitle="Shared UI running on mobile.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut()}
      />
      <Text style={{ color: suitTheme.colors.muted }}>
        Flag: {SixSenseProofFeatureFlags.enableV2Flow}
      </Text>
    </AppFrame>
  );
}
