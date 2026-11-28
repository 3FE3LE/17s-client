'use client';

import { useTranslation } from '@17suit/i18n/react';
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

const ROLE_OPTIONS: ReadonlyArray<{ role: AppRole; key: 'player' | 'owner' }> = [
  { role: 'PLAYER', key: 'player' },
  { role: 'OWNER', key: 'owner' },
];

export function RoleSelectorClient({ preferredRole = null }: { preferredRole?: AppRole | null }) {
  const { t } = useTranslation('shell');
  const router = useRouter();
  const { error: roleError, refetch } = useCurrentUserRoleQuery();
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const [submittingRole, setSubmittingRole] = useState<AppRole | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const orderedOptions = preferredRole
    ? [...ROLE_OPTIONS].sort(
        (a, b) => Number(b.role === preferredRole) - Number(a.role === preferredRole),
      )
    : ROLE_OPTIONS;

  async function handleSetRole(role: AppRole) {
    setSubmitError(null);
    setStatus(null);
    setSubmittingRole(role);
    try {
      await setRoleMutation.mutateAsync(role);
      setStatus(t('onboarding.done'));
      router.replace(getRoleHomePath(role));
    } catch (error) {
      setSubmitError(describeError(error, t('onboarding.saveError')));
      setSubmittingRole(null);
    }
  }

  return (
    <AppFrame appName={t('onboarding.title')} subtitle={t('onboarding.subtitle')}>
      {roleError ? (
        <div className="grid gap-sm">
          <InlineError message={t('onboarding.roleCheckError')} />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void refetch()}>
            {t('onboarding.retry')}
          </AppButton>
        </div>
      ) : null}

      <ul className="m-0 grid list-none gap-md p-0 md:grid-cols-2">
        {orderedOptions.map((option) => (
          <li
            key={option.role}
            className={
              option.role === preferredRole
                ? 'grid content-between gap-md rounded-[var(--radius-lg)] border-2 border-action-primary bg-action-primary-soft p-lg'
                : 'grid content-between gap-md rounded-[var(--radius-lg)] border border-border-strong bg-background p-lg'
            }
          >
            <div className="grid gap-xs">
              <h2 className="m-0 font-arvo text-lg leading-[1.3] text-text">
                {t(`onboarding.${option.key}.title`)}
              </h2>
              <p className="m-0 text-md leading-[1.5] text-muted">
                {t(`onboarding.${option.key}.description`)}
              </p>
            </div>
            <AppButton
              variant={preferredRole && option.role !== preferredRole ? 'neutral' : 'primary'}
              disabled={submittingRole !== null}
              onPress={() => void handleSetRole(option.role)}
            >
              {submittingRole === option.role
                ? t('onboarding.saving')
                : t(`onboarding.${option.key}.cta`)}
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
