import { redirect } from 'next/navigation';
import { RoleSelectorClient } from './role-selector-client';
import { getCurrentUserRole } from '@/lib/current-user-role';
import { getRoleHomePath } from '@/lib/role';

const PREFERRED_ROLE = { jugador: 'PLAYER', complejo: 'OWNER' } as const;

export default async function OnboardingRolePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { role } = await getCurrentUserRole();

  if (role) {
    redirect(getRoleHomePath(role));
  }

  // `?rol=` comes from the landing CTA the user picked; it only pre-selects.
  const raw = (await searchParams).rol;
  const key = Array.isArray(raw) ? raw[0] : raw;
  const preferredRole =
    key && key in PREFERRED_ROLE ? PREFERRED_ROLE[key as keyof typeof PREFERRED_ROLE] : null;

  return <RoleSelectorClient preferredRole={preferredRole} />;
}
