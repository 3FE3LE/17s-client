import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { E2E_SESSION_COOKIE, fakeUserId, isFakeAuthEnabled, parseFakeSession } from './fake-auth';

export interface ServerAuth {
  userId: string | null;
  getToken: (options?: { template?: string }) => Promise<string | null>;
}

/** Clerk `auth()` in every environment except E2E, where the fake session cookie is used. */
export async function getServerAuth(): Promise<ServerAuth> {
  if (isFakeAuthEnabled()) {
    const token = parseFakeSession((await cookies()).get(E2E_SESSION_COOKIE)?.value);
    return {
      userId: token ? fakeUserId(token) : null,
      getToken: () => Promise.resolve(token),
    };
  }
  const { userId, getToken } = await auth();
  return { userId, getToken };
}
