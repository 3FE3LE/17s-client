import { z } from 'zod';

export const SevenReservationsClubEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SevenReservationsClubEntity = z.infer<typeof SevenReservationsClubEntitySchema>;

export const SevenReservationsClubFeatureFlags = {
  enableV2Flow: 'seven-reservations-club.enable_v2_flow',
  enableAdvancedAnalytics: 'seven-reservations-club.enable_advanced_analytics',
} as const;

export function validateSevenReservationsClubEntity(input: unknown): SevenReservationsClubEntity {
  return SevenReservationsClubEntitySchema.parse(input);
}
