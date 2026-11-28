import type { Translate } from '@/lib/seven-rc-format';

export type DepositPolicy = 'refund' | 'retain' | 'owner_decides';
export type DepositOutcome = 'none' | 'refunded' | 'retained';

export function depositPolicyLabel(policy: DepositPolicy, t: Translate): string {
  return t(`format:deposit.policy.${policy}`);
}

export const DEPOSIT_POLICY_VALUES = ['owner_decides', 'refund', 'retain'] as const;

export function depositPolicyOptions(t: Translate): { value: DepositPolicy; label: string }[] {
  return DEPOSIT_POLICY_VALUES.map((value) => ({
    value,
    label: depositPolicyLabel(value, t),
  }));
}

export function depositOutcomeLabel(outcome: DepositOutcome, t: Translate): string {
  return t(`format:deposit.outcome.${outcome}`);
}

/** Conditions a player accepts when booking, in the order they read them. */
export interface PolicySummaryInput {
  cancellationWindowHours: number;
  lateCancelDeposit: DepositPolicy;
  noShowDeposit: DepositPolicy;
  conditionsText?: string | null;
}

export function policySummaryLines(policy: PolicySummaryInput, t: Translate): string[] {
  const hours = policy.cancellationWindowHours;
  return [
    hours > 0
      ? t('format:deposit.summary.windowHours', {
          hours: t(`format:deposit.summary.${hours === 1 ? 'hourOne' : 'hourMany'}`, {
            count: hours,
          }),
        })
      : t('format:deposit.summary.windowStart'),
    t('format:deposit.summary.lateCancel', {
      policy: depositPolicyLabel(policy.lateCancelDeposit, t).toLowerCase(),
    }),
    t('format:deposit.summary.noShow', {
      policy: depositPolicyLabel(policy.noShowDeposit, t).toLowerCase(),
    }),
  ];
}

/** Narrows a free string to a deposit policy; unknown values read as "owner decides". */
export function asDepositPolicy(value: string): DepositPolicy {
  return value === 'refund' || value === 'retain' ? value : 'owner_decides';
}
