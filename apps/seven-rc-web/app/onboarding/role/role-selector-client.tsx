'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppFrame } from '@17suit/ui';
import { InlineError } from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import { getRoleHomePath, type AppRole } from '@/lib/role';

const ROLE_OPTIONS: ReadonlyArray<{
  role: AppRole;
  title: string;
  description: string;
  cta: string;
}> = [
  {
    role: 'PLAYER',
    title: 'Quiero reservar canchas',
    description: 'Busca complejos, elige un horario libre y sigue el estado de tus reservas.',
    cta: 'Continuar como jugador',
  },
  {
    role: 'OWNER',
    title: 'Administro un complejo',
    description: 'Publica tus canchas y horarios, y confirma o rechaza las solicitudes.',
    cta: 'Continuar como dueño de complejo',
  },
];

export function RoleSelectorClient() {
  const router = useRouter();
  const { error: roleError, refetch } = useCurrentUserRoleQuery();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const [submittingRole, setSubmittingRole] = useState<AppRole | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSetRole(role: AppRole) {
    setSubmitError(null);
    setStatus(null);
    setSubmittingRole(role);
    try {
      await setRoleMutation.mutateAsync(role);
      setStatus('Listo. Te llevamos a tu panel…');
      router.replace(getRoleHomePath(role));
    } catch (error) {
      setSubmitError(describeError(error, 'No se pudo guardar tu elección. Intenta de nuevo.'));
      setSubmittingRole(null);
    }
  }

  return (
    <AppFrame
      appName="¿Cómo vas a usar Seven RC?"
      subtitle="Elige una opción. Define qué ves al entrar."
    >
      {roleError ? (
        <div className="grid gap-sm">
          <InlineError message="No pudimos revisar tu cuenta. Puedes elegir igual o reintentar." />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void refetch()}>
            Reintentar
          </AppButton>
        </div>
      ) : null}

      <ul className="m-0 grid list-none gap-md p-0 md:grid-cols-2">
        {ROLE_OPTIONS.map((option) => (
          <li
            key={option.role}
            className="grid content-between gap-md rounded-[var(--radius-lg)] border border-border-strong bg-background p-lg"
          >
            <div className="grid gap-xs">
              <h2 className="m-0 font-arvo text-lg leading-[1.3] text-text">{option.title}</h2>
              <p className="m-0 text-md leading-[1.5] text-muted">{option.description}</p>
            </div>
            <AppButton
              variant="primary"
              disabled={submittingRole !== null}
              onPress={() => void handleSetRole(option.role)}
            >
              {submittingRole === option.role ? 'Guardando…' : option.cta}
            </AppButton>
          </li>
        ))}
      </ul>

      <InlineError message={submitError} />
      <p
        aria-live="polite"
        role="status"
        className="m-0 min-h-[18px] text-sm leading-[18px] text-muted"
      >
        {status ?? ''}
      </p>
    </AppFrame>
  );
}
