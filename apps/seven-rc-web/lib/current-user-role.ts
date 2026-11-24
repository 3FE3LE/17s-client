import { currentUser } from '@clerk/nextjs/server';
import { extractSevenReservationsClubRoleFromMePayload } from '@17suit/module-seven-reservations-club';
import { isAppRole, type AppRole } from './role';
import { isFakeAuthEnabled } from './fake-auth';
import { fetchPlatformMe } from './platform-api';
import { getServerAuth } from './server-auth';

export interface CurrentUserRoleResult {
  role: AppRole | null;
  source: 'backend' | 'clerk' | 'none';
}

export async function getCurrentUserRole(): Promise<CurrentUserRoleResult> {
  const { userId, getToken } = await getServerAuth();

  if (!userId) {
    return { role: null, source: 'none' };
  }

  const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
  const token = tokenTemplate ? await getToken({ template: tokenTemplate }) : await getToken();
  if (token) {
    try {
      const payload = await fetchPlatformMe(token);
      const backendRole = extractSevenReservationsClubRoleFromMePayload(payload);
      if (backendRole) {
        return { role: backendRole, source: 'backend' };
      }
    } catch {
      // Fall back to Clerk metadata when backend is unavailable.
    }
  }

  if (isFakeAuthEnabled()) {
    return { role: null, source: 'none' };
  }

  const user = await currentUser();
  const clerkRole = user?.publicMetadata?.role;

  if (isAppRole(clerkRole)) {
    return { role: clerkRole, source: 'clerk' };
  }

  return { role: null, source: 'none' };
}
