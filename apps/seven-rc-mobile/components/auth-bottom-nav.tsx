import { AppBottomTabBar } from '@17suit/ui';
import { usePathname, useRouter } from 'expo-router';
import { requestTabTransition } from './tab-transition';

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
          onPress: () => {
            if (pathname === '/home') return;
            requestTabTransition('right', () => router.replace('/home'));
          },
          iconName: 'home',
        },
        {
          key: 'profile',
          label: 'Perfil',
          isActive: pathname === '/profile',
          onPress: () => {
            if (pathname === '/profile') return;
            requestTabTransition('left', () => router.replace('/profile'));
          },
          iconName: 'profile',
        },
      ]}
    />
  );
}
