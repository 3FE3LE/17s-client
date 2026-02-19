'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppFrame } from '@17suit/ui';
import { getRoleHomePath } from '@/lib/role';

export default function PlayPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!role) {
      router.replace('/onboarding/role');
      return;
    }

    if (role !== 'PLAYER') {
      router.replace(getRoleHomePath(role));
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== 'PLAYER') {
    return (
      <AppFrame appName="Player Dashboard" subtitle="Verificando tu rol...">
        <p>Un momento...</p>
      </AppFrame>
    );
  }

  return (
    <AppFrame appName="Player Dashboard" subtitle="Panel inicial para jugadores">
      <div style={{ display: 'grid', gap: 10 }}>
        <Link href="#">Buscar complejo</Link>
        <Link href="#">Reservar</Link>
      </div>
    </AppFrame>
  );
}
