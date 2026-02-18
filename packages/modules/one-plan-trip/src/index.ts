import { z } from 'zod';

export const OnePlanTripEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OnePlanTripEntity = z.infer<typeof OnePlanTripEntitySchema>;

export const OnePlanTripFeatureFlags = {
  enableV2Flow: 'one-plan-trip.enable_v2_flow',
  enableAdvancedAnalytics: 'one-plan-trip.enable_advanced_analytics',
} as const;

export function validateOnePlanTripEntity(input: unknown): OnePlanTripEntity {
  return OnePlanTripEntitySchema.parse(input);
}
