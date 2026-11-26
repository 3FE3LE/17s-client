import type { BrowserContext } from '@playwright/test';

/** Signs the browser in as a fresh fake user (`E2E_FAKE_AUTH`, see lib/fake-auth.ts). */
export async function signInAs(
  context: BrowserContext,
  prefix: 'owner' | 'player',
): Promise<string> {
  const clerkUserId = `e2e_${prefix}_${Date.now()}`;
  await context.addCookies([
    {
      name: 'e2e_session',
      value: `test:${clerkUserId}`,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  return clerkUserId;
}
