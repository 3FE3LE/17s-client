import { z } from 'zod';

export const TwoSplitBillEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TwoSplitBillEntity = z.infer<typeof TwoSplitBillEntitySchema>;

export const TwoSplitBillFeatureFlags = {
  enableV2Flow: 'two-split-bill.enable_v2_flow',
  enableAdvancedAnalytics: 'two-split-bill.enable_advanced_analytics',
} as const;

export function validateTwoSplitBillEntity(input: unknown): TwoSplitBillEntity {
  return TwoSplitBillEntitySchema.parse(input);
}
