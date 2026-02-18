import { z } from 'zod';

export const SixSenseProofEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SixSenseProofEntity = z.infer<typeof SixSenseProofEntitySchema>;

export const SixSenseProofFeatureFlags = {
  enableV2Flow: 'six-sense-proof.enable_v2_flow',
  enableAdvancedAnalytics: 'six-sense-proof.enable_advanced_analytics',
} as const;

export function validateSixSenseProofEntity(input: unknown): SixSenseProofEntity {
  return SixSenseProofEntitySchema.parse(input);
}
