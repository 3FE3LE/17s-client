import type { PropsWithChildren } from 'react';
import { AppFrame, YStack } from '@17suit/ui';
import { AuthBottomNav } from './auth-bottom-nav';

type UserRole = 'OWNER' | 'PLAYER' | null | undefined;

interface AuthTabScreenProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  role?: UserRole;
}

export function AuthTabScreen({ appName, subtitle, role, children }: AuthTabScreenProps) {
  return (
    <YStack style={{ flex: 1 }}>
      <YStack style={{ flex: 1 }}>
        <AppFrame appName={appName} {...(subtitle ? { subtitle } : {})}>
          {children}
        </AppFrame>
      </YStack>
      <AuthBottomNav role={role} />
    </YStack>
  );
}
