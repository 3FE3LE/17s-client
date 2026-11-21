import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AccessDenied } from '@/components/access-denied';
import { AdminShell } from '@/components/admin-shell';
import { getDeploymentEnvironment } from '@/lib/environment';
import { getOperatorAccess } from '@/lib/operator-access';

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
