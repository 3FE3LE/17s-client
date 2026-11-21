import { currentUser } from '@clerk/nextjs/server';
import { AdminHome } from '@/components/admin-home';

export default async function Page() {
  // proxy.ts guarantees a session here; currentUser() only resolves display identity.
  const user = await currentUser();
  const operatorEmail =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? null;

  return <AdminHome operatorEmail={operatorEmail} />;
}
