import { z } from 'zod';

export const EightDreamDishesEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EightDreamDishesEntity = z.infer<typeof EightDreamDishesEntitySchema>;

export const EightDreamDishesFeatureFlags = {
  enableV2Flow: 'eight-dream-dishes.enable_v2_flow',
  enableAdvancedAnalytics: 'eight-dream-dishes.enable_advanced_analytics',
} as const;

export function validateEightDreamDishesEntity(input: unknown): EightDreamDishesEntity {
  return EightDreamDishesEntitySchema.parse(input);
}
