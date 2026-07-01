import { z } from 'zod';
export * from './onboarding-role';
export * from './sdk/seven-rc-api';

export const NineCareCompanionEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type NineCareCompanionEntity = z.infer<typeof NineCareCompanionEntitySchema>;

export const NineCareCompanionFeatureFlags = {
  enableV2Flow: 'nine-care-companion.enable_v2_flow',
  enableAdvancedAnalytics: 'nine-care-companion.enable_advanced_analytics',
} as const;

export function validateNineCareCompanionEntity(input: unknown): NineCareCompanionEntity {
  return NineCareCompanionEntitySchema.parse(input);
}
