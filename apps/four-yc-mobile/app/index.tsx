import { useClerk, useUser } from '@clerk/clerk-expo';
import { FourYouClosetFeatureFlags } from '@17suit/module-four-you-closet';
import { AppFrame, AppProfile, suitTheme } from '@17suit/ui';
import { Text } from 'react-native';

export default function IndexScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Four You Closet" subtitle="Shared Tamagui UI running on mobile.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut()}
      />
      <Text style={{ color: suitTheme.colors.muted }}>
        Flag: {FourYouClosetFeatureFlags.enableV2Flow}
      </Text>
    </AppFrame>
  );
}
