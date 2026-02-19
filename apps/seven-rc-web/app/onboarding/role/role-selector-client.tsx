'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  OnboardingRoleSelector,
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import { AppFrame } from '@17suit/ui';
import { getRoleHomePath, type AppRole } from '@/lib/role';

export function RoleSelectorClient() {
  const router = useRouter();
  const { role: currentRole, source, error: roleError, refetch } = useCurrentUserRoleQuery();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const [isSubmittingRole, setIsSubmittingRole] = useState<AppRole | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSetRole = async (role: AppRole) => {
    setSubmitError(null);
    setIsSubmittingRole(role);

    try {
      await setRoleMutation.mutateAsync(role);

      setToast('Rol guardado correctamente. Redirigiendo...');
      router.replace(getRoleHomePath(role));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo guardar tu rol');
      setToast('No se pudo guardar el rol. Intenta de nuevo.');
    } finally {
      setIsSubmittingRole(null);
    }
  };

  return (
    <AppFrame
      appName="Seven Reservations Club"
      subtitle="Elige tu perfil inicial para personalizar tu experiencia"
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <OnboardingRoleSelector
          role={currentRole}
          source={source}
          isSubmittingRole={isSubmittingRole}
          roleError={roleError}
          submitError={submitError}
          onRetryLoad={() => void refetch()}
          onClearSubmitError={() => setSubmitError(null)}
          onSelectRole={(role) => void handleSetRole(role)}
        />
        {toast ? (
          <div
            style={{
              position: 'fixed',
              right: 20,
              bottom: 20,
              padding: '10px 14px',
              borderRadius: 10,
              background: '#0f5132',
              color: '#e8fff4',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              zIndex: 1000,
            }}
          >
            {toast}
          </div>
        ) : null}
      </div>
    </AppFrame>
  );
}
