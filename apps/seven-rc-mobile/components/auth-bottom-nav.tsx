import { AppBottomTabBar } from '@17suit/ui';
import { usePathname, useRouter } from 'expo-router';

type UserRole = 'OWNER' | 'PLAYER' | null | undefined;

interface AuthBottomNavProps {
  role?: UserRole;
}

export function AuthBottomNav({ role }: AuthBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppBottomTabBar
      tone={role}
      showLabels={false}
      items={[
        {
          key: 'home',
          label: 'Inicio',
          isActive: pathname === '/home',
          onPress: () => router.replace('/home'),
          iconName: 'home',
        },
        {
          key: 'profile',
          label: 'Perfil',
          isActive: pathname === '/profile',
          onPress: () => router.replace('/profile'),
          iconName: 'profile',
        },
      ]}
    />
  );
}
