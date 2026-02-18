import { z } from 'zod';

export const FiveBarberGoEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FiveBarberGoEntity = z.infer<typeof FiveBarberGoEntitySchema>;

export const FiveBarberGoFeatureFlags = {
  enableV2Flow: 'five-barber-go.enable_v2_flow',
  enableAdvancedAnalytics: 'five-barber-go.enable_advanced_analytics',
} as const;

export function validateFiveBarberGoEntity(input: unknown): FiveBarberGoEntity {
  return FiveBarberGoEntitySchema.parse(input);
}
