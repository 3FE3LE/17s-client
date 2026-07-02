import { z } from 'zod';

// Day-1 entity shared by web + mobile. Backend stays the single source of truth;
// this is the surface schema only — used for fetch parsing and form validation.
export const CareCircleMemberSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['PRIMARY', 'SECONDARY', 'PROFESSIONAL', 'VIEWER']),
  caregiverId: z.string().uuid(),
  displayName: z.string().min(1),
});
export type CareCircleMember = z.infer<typeof CareCircleMemberSchema>;

export const CareCircleSummarySchema = z.object({
  id: z.string().uuid(),
  patientDisplayName: z.string().min(1),
  members: z.array(CareCircleMemberSchema),
  blocksToday: z.object({
    pending: z.number().int().nonnegative(),
    confirmed: z.number().int().nonnegative(),
    missed: z.number().int().nonnegative(),
    postponed: z.number().int().nonnegative(),
  }),
});
export type CareCircleSummary = z.infer<typeof CareCircleSummarySchema>;

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

// Post-auth landing for the signed-in caregiver. Day-1 only has the care
// dashboard surface, so the post-auth path is just the home route.
export const NINE_CC_POST_AUTH_PATH = '/';
export function getNineCareCompanionPostAuthPath(): string {
  return NINE_CC_POST_AUTH_PATH;
}

export const NINE_CC_FEATURE_FLAGS = {
  enableEscalationEngine: 'nine-care-companion.enable_escalation_engine',
  enableAlexaMirror: 'nine-care-companion.enable_alexa_mirror',
} as const;

export function validateCareCircleSummary(input: unknown): CareCircleSummary {
  return CareCircleSummarySchema.parse(input);
}

export function validateDailyTimeline(input: unknown): DailyTimeline {
  return DailyTimelineSchema.parse(input);
}
