import { DISPLAY_LOCALE, type Translate } from '@/lib/seven-rc-format';
import type { ReservationPaymentKind, ReservationPaymentMethod } from '@/lib/owner-queries';

/** Largest amount (minor units) the API accepts: a 32-bit signed int. */
export const MAX_AMOUNT_MINOR = 2_147_483_647;

const PAYMENT_KINDS: ReadonlyArray<ReservationPaymentKind> = ['deposit', 'balance', 'refund'];
const PAYMENT_METHODS: ReadonlyArray<ReservationPaymentMethod> = [
  'transfer',
  'cash',
  'card',
  'other',
];

export function paymentKindOptions(
  t: Translate,
): Array<{ value: ReservationPaymentKind; label: string }> {
  return PAYMENT_KINDS.map((value) => ({ value, label: t(`format:payment.kind.${value}`) }));
}

export function paymentMethodOptions(
  t: Translate,
): Array<{ value: ReservationPaymentMethod; label: string }> {
  return PAYMENT_METHODS.map((value) => ({ value, label: t(`format:payment.method.${value}`) }));
}

/**
 * es-CO amount typed by the owner ("120.000", "120000", "12,50") to minor units. Anything
 * ambiguous ("120,000", "-5") is refused rather than guessed: this is money.
 */
export function parseAmount(value: string): number | null {
  const match = /^(\d+|\d{1,3}(?:[. ]\d{3})+)(?:,(\d{1,2}))?$/.exec(value.trim());
  if (!match?.[1]) return null;
  const minor =
    Number(match[1].replace(/[. ]/g, '')) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  return minor <= MAX_AMOUNT_MINOR ? minor : null;
}

/** Inverse of parseAmount, for prefilling a field. */
export function formatAmountInput(amountMinor: number): string {
  return new Intl.NumberFormat(DISPLAY_LOCALE, { maximumFractionDigits: 2 }).format(
    amountMinor / 100,
  );
}
