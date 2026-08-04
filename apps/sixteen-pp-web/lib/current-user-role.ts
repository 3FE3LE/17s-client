import { auth, currentUser } from '@clerk/nextjs/server';
import { isAppRole, type AppRole } from './role';

export interface CurrentUserRoleResult {
  role: AppRole | null;
  source: 'clerk' | 'none';
}

/**
 * MVP has no product backend — role resolution reads Clerk metadata only.
 * Extend to call a platform API when the product gains authenticated state.
 */
export async function getCurrentUserRole(): Promise<CurrentUserRoleResult> {
  const { userId } = await auth();
  if (!userId) {
    return { role: null, source: 'none' };
  }

  const user = await currentUser();
  const clerkRole = user?.publicMetadata?.role;
  if (isAppRole(clerkRole)) {
    return { role: clerkRole, source: 'clerk' };
  }

  return { role: null, source: 'none' };
}
