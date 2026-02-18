import { useClerk, useUser } from '@clerk/clerk-expo';
import { FiveBarberGoFeatureFlags } from '@17suit/module-five-barber-go';
import { AppFrame, AppProfile, suitTheme } from '@17suit/ui';
import { Text } from 'react-native';

export default function IndexScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <AppFrame appName="Five Barber Go" subtitle="Shared Tamagui UI running on mobile.">
      <AppProfile
        fullName={user?.fullName ?? null}
        email={user?.primaryEmailAddress?.emailAddress ?? null}
        userId={user?.id ?? null}
        onSignOut={() => signOut()}
      />
      <Text style={{ color: suitTheme.colors.muted }}>
        Flag: {FiveBarberGoFeatureFlags.enableV2Flow}
      </Text>
    </AppFrame>
  );
}
