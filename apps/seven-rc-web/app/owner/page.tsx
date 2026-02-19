'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppFrame } from '@17suit/ui';
import { getRoleHomePath } from '@/lib/role';

export default function OwnerPage() {
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

    if (role !== 'OWNER') {
      router.replace(getRoleHomePath(role));
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== 'OWNER') {
    return (
      <AppFrame appName="Owner Dashboard" subtitle="Verificando tu rol...">
        <p>Un momento...</p>
      </AppFrame>
    );
  }

  return (
    <AppFrame appName="Owner Dashboard" subtitle="Panel inicial para duenos de complejo">
      <div style={{ display: 'grid', gap: 10 }}>
        <Link href="#">Crear complejo</Link>
        <Link href="#">Crear cancha</Link>
        <Link href="#">Reservas pendientes</Link>
      </div>
    </AppFrame>
  );
}
