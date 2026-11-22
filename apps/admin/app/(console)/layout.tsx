import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AccessDenied } from '@/components/access-denied';
import { AdminShell } from '@/components/admin-shell';
import { resolveLandingHomeUrl } from '@/lib/auth-bridge';
import { getDeploymentEnvironment } from '@/lib/environment';
import { getOperatorAccess } from '@/lib/operator-access';

// Optional, server-only: who to ask for access (an email or a name). Shown on
// the 403 view only; unset falls back to a generic line with no address.
function readAccessContact(): string | null {
  const contact = process.env.ADMIN_ACCESS_CONTACT?.trim();
  return contact ? contact : null;
}

// Every console route renders through here. proxy.ts guarantees a Clerk session;
// this layout adds the operator allowlist on top (deny by default).
export default async function ConsoleLayout({ children }: { children: ReactNode }) {
  const access = await getOperatorAccess();

  if (access.status === 'denied') {
    if (access.reason === 'no-session') {
      // proxy.ts should have caught this; send them back through sign-in.
      redirect('/sign-in');
    }
    return (
      <AccessDenied
        email={access.email}
        accessContact={readAccessContact()}
        landingHomeUrl={resolveLandingHomeUrl()}
        showMissingAllowlistHint={
          access.reason === 'allowlist-missing' && process.env.NODE_ENV === 'development'
        }
      />
    );
  }

  return (
    <AdminShell environment={getDeploymentEnvironment()} operatorEmail={access.email}>
      {children}
    </AdminShell>
  );
}
