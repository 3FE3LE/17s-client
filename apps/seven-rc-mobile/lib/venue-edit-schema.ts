import { coAddressDraftSchema, coAddressFromDraft, intInRange } from '@17suit/core';
import { z } from 'zod';

/** Same limits as the web venue forms and the server `UpdateVenueSettingsDto`. */
export const VENUE_NAME_MIN = 3;
export const VENUE_NAME_MAX = 120;
export const PAYMENT_INSTRUCTIONS_MAX = 500;
export const CONDITIONS_TEXT_MAX = 1000;

export const DEPOSIT_POLICY_VALUES = ['owner_decides', 'refund', 'retain'] as const;
export type DepositPolicy = (typeof DEPOSIT_POLICY_VALUES)[number];

/** E.164: "+" then 8 to 15 digits, first digit not zero. */
export const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

export function asDepositPolicy(value: string): DepositPolicy {
  return (DEPOSIT_POLICY_VALUES as readonly string[]).includes(value)
    ? (value as DepositPolicy)
    : 'owner_decides';
}

/** Accepts "+57 300 123 4567" or a local Colombian mobile ("300 123 4567"). */
export function normalizePhone(value: string, countryCode: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/[\s().-]/g, '');
  if (compact.startsWith('+')) return compact;
  if (countryCode === 'CO' && /^3\d{9}$/.test(compact)) return `+57${compact}`;
  return compact;
}

/**
 * Schema messages are stable codes under `venueEdit.errors.*` in the `mobile`
 * catalog; the screen translates them. `hadPhone` blocks clearing a saved phone
 * (the server has no way to unset it).
 */
export function buildVenueEditSchema(countryCode: string, hadPhone: boolean) {
  return z
    .object({
      name: z.string().trim().min(VENUE_NAME_MIN, 'nameMin').max(VENUE_NAME_MAX, 'nameMax'),
      address: coAddressDraftSchema,
      contactPhone: z.string(),
      paymentInstructions: z.string().max(PAYMENT_INSTRUCTIONS_MAX, 'paymentInstructionsMax'),
      depositPercent: intInRange(0, 100, 'depositPercent'),
      holdMinutes: intInRange(5, 1440, 'holdMinutes'),
      cancellationWindowHours: intInRange(0, 168, 'cancellationWindowHours'),
      lateCancelDeposit: z.enum(DEPOSIT_POLICY_VALUES),
      noShowDeposit: z.enum(DEPOSIT_POLICY_VALUES),
      conditionsText: z.string().max(CONDITIONS_TEXT_MAX, 'conditionsMax'),
      bookingHorizonDays: intInRange(1, 180, 'bookingHorizonDays'),
    })
    .superRefine((values, issues) => {
      const phone = normalizePhone(values.contactPhone, countryCode);
      if (phone && !E164_PATTERN.test(phone)) {
        issues.addIssue({ code: 'custom', path: ['contactPhone'], message: 'phoneFormat' });
      } else if (!phone && hadPhone) {
        issues.addIssue({ code: 'custom', path: ['contactPhone'], message: 'phoneRequired' });
      }
    });
}

export type VenueEditValues = z.infer<ReturnType<typeof buildVenueEditSchema>>;

/** Server DTO property to form field, only for fields with an inline error. */
export const VENUE_EDIT_FIELD_MAP = {
  name: 'name',
  contactPhone: 'contactPhone',
  depositPercent: 'depositPercent',
  holdMinutes: 'holdMinutes',
  cancellationWindowHours: 'cancellationWindowHours',
  bookingHorizonDays: 'bookingHorizonDays',
} as const;

/** Request body for `PATCH /7rc/venues/:id/settings` from validated form values. */
export function toVenueEditInput(values: VenueEditValues, countryCode: string) {
  const phone = normalizePhone(values.contactPhone, countryCode);
  const addressParts = coAddressFromDraft(values.address);
  return {
    name: values.name.trim(),
    ...(addressParts ? { addressParts } : {}),
    ...(phone ? { contactPhone: phone } : {}),
    paymentInstructions: values.paymentInstructions.trim(),
    depositPercent: Number(values.depositPercent),
    holdMinutes: Number(values.holdMinutes),
    cancellationWindowHours: Number(values.cancellationWindowHours),
    lateCancelDeposit: values.lateCancelDeposit,
    noShowDeposit: values.noShowDeposit,
    conditionsText: values.conditionsText.trim(),
    bookingHorizonDays: Number(values.bookingHorizonDays),
  };
}
