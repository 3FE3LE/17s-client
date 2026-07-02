import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────
// Day-1 schema: backend stays single source of truth. Every schema here is
// the surface shape (after the BFF + server hop) for use in fetch parsing,
// form validation, and rendering. Mirror the server DTOs exactly.
// ─────────────────────────────────────────────────────────────────────────

export const SLOT_NAMES = ['morning', 'afternoon', 'evening', 'night'] as const;
export type SlotName = (typeof SLOT_NAMES)[number];
export const SlotNameSchema = z.enum(SLOT_NAMES);

// Server → client post-auth path (signed-in caregiver lands here).
export const NINE_CC_POST_AUTH_PATH = '/';
export function getNineCareCompanionPostAuthPath(): string {
  return NINE_CC_POST_AUTH_PATH;
}

// Care Circle summary — mirror the server's flat shape.
export const CareCircleSummarySchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string().min(1),
  members: z.array(
    z.object({
      id: z.string().uuid(),
      role: z.enum(['PRIMARY', 'SECONDARY', 'PROFESSIONAL', 'VIEWER']),
      caregiverId: z.string().uuid(),
      displayName: z.string().min(1),
    }),
  ),
  blocksToday: z.number().int().nonnegative(),
  blocksPendingToday: z.number().int().nonnegative(),
  blocksConfirmedToday: z.number().int().nonnegative(),
  blocksMissedToday: z.number().int().nonnegative(),
});
export type CareCircleSummary = z.infer<typeof CareCircleSummarySchema>;

// Daily timeline (full block-level view).
export const DailyTimelineBlockSchema = z.object({
  id: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  medicationName: z.string().min(1),
  dosage: z.string(),
  critical: z.boolean(),
  status: z.enum(['PENDING', 'CONFIRMED', 'MISSED', 'POSTPONED']),
  confirmation: z
    .object({
      id: z.string().uuid(),
      status: z.enum(['taken', 'skipped', 'unknown']),
      caregiverId: z.string().uuid().nullable(),
      notes: z.string().nullable(),
      recordedAt: z.string().datetime(),
    })
    .nullable(),
});
export type DailyTimelineBlock = z.infer<typeof DailyTimelineBlockSchema>;

export const DailyTimelineSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  blocks: z.array(DailyTimelineBlockSchema),
});
export type DailyTimeline = z.infer<typeof DailyTimelineSchema>;

// Voice-shaped (alexa-mirror + web dashboard) summary.
export const MedicationBlockSummarySchema = z.object({
  id: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  medicationName: z.string().min(1),
  dosage: z.string(),
  critical: z.boolean(),
  status: z.enum(['PENDING', 'CONFIRMED', 'MISSED', 'POSTPONED']),
  voiceLine: z.string().min(1),
});
export type MedicationBlockSummary = z.infer<typeof MedicationBlockSummarySchema>;

// Voice-friendly instructions DTO.
export const MedicationBlockInstructionsSchema = z.object({
  blockId: z.string().uuid(),
  patientDisplayName: z.string().min(1),
  slotLabelEs: z.string().min(1),
  scheduledAt: z.string().datetime(),
  status: z.enum(['PENDING', 'CONFIRMED', 'MISSED', 'POSTPONED']),
  instructions: z.string().min(1),
});
export type MedicationBlockInstructions = z.infer<typeof MedicationBlockInstructionsSchema>;

// Confirmation request bodies (id-based and slot-based write paths share a body).
export const ConfirmationStatusSchema = z.enum(['taken', 'skipped', 'unknown']);
export const CreateConfirmationSchema = z.object({
  status: ConfirmationStatusSchema,
  notes: z.string().max(500).optional(),
});
export type CreateConfirmationInput = z.infer<typeof CreateConfirmationSchema>;

export const NINE_CC_FEATURE_FLAGS = {
  enableEscalationEngine: 'nine-care-companion.enable_escalation_engine',
  enableAlexaMirror: 'nine-care-companion.enable_alexa_mirror',
} as const;

// Validators (typed throws on invalid input).
export function validateCareCircleSummary(input: unknown): CareCircleSummary {
  return CareCircleSummarySchema.parse(input);
}
export function validateDailyTimeline(input: unknown): DailyTimeline {
  return DailyTimelineSchema.parse(input);
}
export function validateMedicationBlockSummary(input: unknown): MedicationBlockSummary {
  return MedicationBlockSummarySchema.parse(input);
}
export function validateMedicationBlockInstructions(
  input: unknown,
): MedicationBlockInstructions {
  return MedicationBlockInstructionsSchema.parse(input);
}
export function validateCreateConfirmation(
  input: unknown,
): CreateConfirmationInput {
  return CreateConfirmationSchema.parse(input);
}
