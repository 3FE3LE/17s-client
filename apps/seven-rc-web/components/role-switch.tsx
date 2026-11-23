'use client';

import {
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import { buttonRecipe } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import { getRoleHomePath, type AppRole } from '@/lib/role';

const COPY: Record<AppRole, { label: string; title: string; body: string; confirm: string }> = {
  OWNER: {
    label: 'Cambiar a modo jugador',
    title: '¿Cambiar a modo jugador?',
    body: 'Verás la búsqueda de canchas y tus reservas como jugador. Tu complejo, canchas y solicitudes siguen guardados; vuelves a ellos cambiando a modo dueño.',
    confirm: 'Cambiar a jugador',
  },
  PLAYER: {
    label: 'Cambiar a modo dueño',
    title: '¿Cambiar a modo dueño?',
    body: 'Verás el panel para administrar un complejo. Tus reservas como jugador siguen guardadas; vuelves a ellas cambiando a modo jugador.',
    confirm: 'Cambiar a dueño',
  },
};

/** Header control, next to sign-out, that flips the account between owner and player. */
export function RoleSwitch() {
  const router = useRouter();
  const { role } = useCurrentUserRoleQuery();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (role !== 'OWNER' && role !== 'PLAYER') return null;
  const copy = COPY[role];
  const nextRole: AppRole = role === 'OWNER' ? 'PLAYER' : 'OWNER';

  async function onConfirm() {
    setError(null);
    try {
      await setRoleMutation.mutateAsync(nextRole);
      // The mutation already flipped the cached role, and with it this dialog's copy:
      // close at once, or a second tap would switch straight back.
      dialogRef.current?.close();
      router.replace(getRoleHomePath(nextRole));
      router.refresh();
    } catch (caught) {
      setError(describeError(caught, 'No se pudo cambiar de modo. Intenta de nuevo.'));
    }
  }

  return (
    <>
      <button
        type="button"
        className={buttonRecipe({
          intent: 'secondary',
          size: 'sm',
          platform: 'web',
          fullWidth: false,
        })}
        onClick={() => {
          setError(null);
          dialogRef.current?.showModal();
        }}
      >
        {copy.label}
      </button>
      <ConfirmDialog
        dialogRef={dialogRef}
        title={copy.title}
        confirmLabel={copy.confirm}
        pendingLabel="Cambiando…"
        dismissLabel="Seguir aquí"
        tone="primary"
        isPending={setRoleMutation.isPending}
        error={error}
        onConfirm={() => void onConfirm()}
        onClosed={() => setError(null)}
      >
        <p className="m-0">{copy.body}</p>
      </ConfirmDialog>
    </>
  );
}
