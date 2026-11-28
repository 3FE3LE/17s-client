'use client';

import {
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import { useTranslation } from '@17suit/i18n/react';
import { buttonRecipe } from '@17suit/ui';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/seven-rc-ui';
import { describeError } from '@/lib/seven-rc-errors';
import { getRoleHomePath, type AppRole } from '@/lib/role';

const COPY_KEY: Record<AppRole, 'ownerToPlayer' | 'playerToOwner'> = {
  OWNER: 'ownerToPlayer',
  PLAYER: 'playerToOwner',
};

/** Header control, next to sign-out, that flips the account between owner and player. */
export function RoleSwitch() {
  const { t } = useTranslation('shell');
  const router = useRouter();
  const { role } = useCurrentUserRoleQuery();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (role !== 'OWNER' && role !== 'PLAYER') return null;
  const copyKey = `roleSwitch.${COPY_KEY[role]}` as const;
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
      setError(describeError(caught, t('roleSwitch.error')));
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
        {t(`${copyKey}.label`)}
      </button>
      <ConfirmDialog
        dialogRef={dialogRef}
        title={t(`${copyKey}.title`)}
        confirmLabel={t(`${copyKey}.confirm`)}
        pendingLabel={t('roleSwitch.pending')}
        dismissLabel={t('roleSwitch.dismiss')}
        tone="primary"
        isPending={setRoleMutation.isPending}
        error={error}
        onConfirm={() => void onConfirm()}
        onClosed={() => setError(null)}
      >
        <p className="m-0">{t(`${copyKey}.body`)}</p>
      </ConfirmDialog>
    </>
  );
}
