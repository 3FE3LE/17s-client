export type DepositPolicy = 'refund' | 'retain' | 'owner_decides';
export type DepositOutcome = 'none' | 'refunded' | 'retained';

export const DEPOSIT_POLICY_LABEL: Record<DepositPolicy, string> = {
  refund: 'Se devuelve el anticipo',
  retain: 'El complejo conserva el anticipo',
  owner_decides: 'El complejo decide qué pasa con el anticipo',
};

export const DEPOSIT_POLICY_OPTIONS: { value: DepositPolicy; label: string }[] = [
  { value: 'owner_decides', label: DEPOSIT_POLICY_LABEL.owner_decides },
  { value: 'refund', label: DEPOSIT_POLICY_LABEL.refund },
  { value: 'retain', label: DEPOSIT_POLICY_LABEL.retain },
];

export const DEPOSIT_OUTCOME_LABEL: Record<DepositOutcome, string> = {
  none: 'Sin anticipo que resolver',
  refunded: 'Anticipo devuelto',
  retained: 'Anticipo conservado',
};

/** Conditions a player accepts when booking, in the order they read them. */
export interface PolicySummaryInput {
  cancellationWindowHours: number;
  lateCancelDeposit: DepositPolicy;
  noShowDeposit: DepositPolicy;
  conditionsText?: string | null;
}

export function policySummaryLines(policy: PolicySummaryInput): string[] {
  const hours = policy.cancellationWindowHours;
  return [
    hours > 0
      ? `Puedes cancelar en línea hasta ${hours} ${hours === 1 ? 'hora' : 'horas'} antes del turno.`
      : 'Puedes cancelar en línea hasta el inicio del turno.',
    `Si cancelas tarde: ${DEPOSIT_POLICY_LABEL[policy.lateCancelDeposit].toLowerCase()}.`,
    `Si no llegas y no avisas: ${DEPOSIT_POLICY_LABEL[policy.noShowDeposit].toLowerCase()}.`,
  ];
}

/** Narrows a free string to a deposit policy; unknown values read as "owner decides". */
export function asDepositPolicy(value: string): DepositPolicy {
  return value === 'refund' || value === 'retain' ? value : 'owner_decides';
}
