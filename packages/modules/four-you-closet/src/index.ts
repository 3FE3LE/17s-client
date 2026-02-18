import { z } from 'zod';

export const FourYouClosetEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FourYouClosetEntity = z.infer<typeof FourYouClosetEntitySchema>;

export const FourYouClosetFeatureFlags = {
  enableV2Flow: 'four-you-closet.enable_v2_flow',
  enableAdvancedAnalytics: 'four-you-closet.enable_advanced_analytics',
} as const;

export function validateFourYouClosetEntity(input: unknown): FourYouClosetEntity {
  return FourYouClosetEntitySchema.parse(input);
}
