import { currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';

// Deny-by-default operator allowlist. There is no operator role in Clerk or in
// 17s-server yet, so access to the console is decided here, server-side only,
// from `ADMIN_ALLOWED_EMAILS` (comma-separated, case-insensitive). The variable
// has no NEXT_PUBLIC_ prefix on purpose: it must never reach the client bundle.
//
// Only *verified* Clerk email addresses count. An unset or empty variable
// denies everyone.

export type OperatorAccess =
  | { status: 'allowed'; email: string; allowlistSize: number }
  | {
      status: 'denied';
      reason: 'no-session' | 'not-listed' | 'allowlist-missing';
      email: string | null;
    };

function readAllowlist(): ReadonlySet<string> {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? '';
  return new Set(
    raw
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry.length > 0),
  );
}

// `cache` dedupes the Clerk lookup across the layout and the page of one request.
export const getOperatorAccess = cache(async (): Promise<OperatorAccess> => {
  const user = await currentUser();
  if (!user) {
    return { status: 'denied', reason: 'no-session', email: null };
  }
  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;

  const allowlist = readAllowlist();
  if (allowlist.size === 0) {
    return { status: 'denied', reason: 'allowlist-missing', email: primaryEmail };
  }

  const verifiedEmails = user.emailAddresses
    .filter((address) => address.verification?.status === 'verified')
    .map((address) => address.emailAddress.toLowerCase());

  const match = verifiedEmails.find((email) => allowlist.has(email));
  if (!match) {
    return { status: 'denied', reason: 'not-listed', email: primaryEmail };
  }

  return { status: 'allowed', email: primaryEmail ?? match, allowlistSize: allowlist.size };
});

// Page-level guard. The console layout already renders the 403 view, but a page's
// RSC payload can be requested on its own during client navigation, so every page
// re-checks before rendering anything.
export async function isOperator(): Promise<boolean> {
  const access = await getOperatorAccess();
  return access.status === 'allowed';
}
