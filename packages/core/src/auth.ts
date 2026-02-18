export interface AuthSession {
  userId: string;
  tenantId: string;
  roles: string[];
  expiresAt: string;
}

export function hasRole(session: AuthSession | null, role: string): boolean {
  return Boolean(session?.roles.includes(role));
}

export function assertSession(session: AuthSession | null): asserts session is AuthSession {
  if (!session) {
    throw new Error('Authentication required');
  }
}
