import { useEffect } from 'react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppFrame } from '@17suit/ui';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();
  const { role, isLoading, error } = useCurrentUserRoleQuery();

  useEffect(() => {
    if (error) {
      router.replace('/onboarding/role');
      return;
    }

    if (isLoading) {
      return;
    }

    if (!role) {
      router.replace('/onboarding/role');
      return;
    }

    router.replace('/home');
  }, [error, isLoading, role, router]);

  return (
    <AppFrame appName="Seven Reservations Club" subtitle="Cargando experiencia...">
      <></>
    </AppFrame>
  );
}
