import { useClerk, useUser } from '@clerk/clerk-expo';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppProfile, YStack } from '@17suit/ui';
import { AuthTabScreen } from '../components/auth-tab-screen';

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { role } = useCurrentUserRoleQuery();

  const roleBadgeLabel = role === 'OWNER' ? 'Cuenta OWNER' : 'Cuenta PLAYER';

  return (
    <AuthTabScreen
      appName="Perfil"
      subtitle="Informacion del usuario logueado y acciones de sesion"
      role={role}
    >
      <YStack style={{ gap: 12 }}>
        <AppButton variant={role === 'OWNER' ? 'success' : 'info'} disabled>
          {roleBadgeLabel}
        </AppButton>
        <AppProfile
          fullName={user?.fullName ?? null}
          email={user?.primaryEmailAddress?.emailAddress ?? null}
          userId={user?.id ?? null}
          onSignOut={() => signOut()}
        />
      </YStack>
    </AuthTabScreen>
  );
}
