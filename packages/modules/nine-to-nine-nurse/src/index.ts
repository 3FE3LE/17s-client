import { z } from 'zod';

export const NineToNineNurseEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type NineToNineNurseEntity = z.infer<typeof NineToNineNurseEntitySchema>;

export const NineToNineNurseFeatureFlags = {
  enableV2Flow: 'nine-to-nine-nurse.enable_v2_flow',
  enableAdvancedAnalytics: 'nine-to-nine-nurse.enable_advanced_analytics',
} as const;

export function validateNineToNineNurseEntity(input: unknown): NineToNineNurseEntity {
  return NineToNineNurseEntitySchema.parse(input);
}
