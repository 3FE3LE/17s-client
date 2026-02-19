import { z } from 'zod';

export const PlatformOnboardingRoleSchema = z.enum(['OWNER', 'PLAYER']);
export type PlatformOnboardingRole = z.infer<typeof PlatformOnboardingRoleSchema>;

export const PlatformOnboardingRoleRequestSchema = z.object({
  role: PlatformOnboardingRoleSchema,
});
export type PlatformOnboardingRoleRequest = z.infer<typeof PlatformOnboardingRoleRequestSchema>;

export const PlatformUserSchema = z.object({
  id: z.string().min(1),
  clerkUserId: z.string().min(1),
  role: PlatformOnboardingRoleSchema,
  email: z.string().email().nullable(),
  name: z.string().min(1).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type PlatformUser = z.infer<typeof PlatformUserSchema>;
