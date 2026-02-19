import { redirect } from 'next/navigation';
import { RoleSelectorClient } from './role-selector-client';
import { getCurrentUserRole } from '@/lib/current-user-role';
import { getRoleHomePath } from '@/lib/role';

export default async function OnboardingRolePage() {
  const { role } = await getCurrentUserRole();

  if (role) {
    redirect(getRoleHomePath(role));
  }

  return <RoleSelectorClient />;
}
