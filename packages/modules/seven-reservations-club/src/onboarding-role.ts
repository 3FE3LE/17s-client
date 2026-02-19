export const SevenReservationsClubRoles = ['OWNER', 'PLAYER'] as const;

export type SevenReservationsClubRole = (typeof SevenReservationsClubRoles)[number];

export type SevenReservationsClubRoleSource = 'backend' | 'clerk' | 'none';

export interface SevenReservationsClubMeRoleResponse {
  role: SevenReservationsClubRole | null;
  source: SevenReservationsClubRoleSource;
}

export interface SevenReservationsClubSetRolePayload {
  role: SevenReservationsClubRole;
}

export interface SevenReservationsClubPlatformUser {
  id: string;
  clerkUserId: string;
  role: SevenReservationsClubRole;
  email: string | null;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SevenReservationsClubRoleOption {
  role: SevenReservationsClubRole;
  title: string;
  subtitle: string;
  cta: string;
}

export const SevenReservationsClubRoleOptions: ReadonlyArray<SevenReservationsClubRoleOption> = [
  {
    role: 'OWNER',
    title: 'Soy dueno de un complejo',
    subtitle: 'Administra complejos, canchas y reservas de tus clientes.',
    cta: 'Continuar como OWNER',
  },
  {
    role: 'PLAYER',
    title: 'Soy jugador',
    subtitle: 'Busca complejos, reserva canchas y gestiona tus partidos.',
    cta: 'Continuar como PLAYER',
  },
] as const;

export function isSevenReservationsClubRole(value: unknown): value is SevenReservationsClubRole {
  return (
    typeof value === 'string' &&
    SevenReservationsClubRoles.includes(value as SevenReservationsClubRole)
  );
}

export function getSevenReservationsClubRoleHomePath(
  role: SevenReservationsClubRole,
): '/owner' | '/play' {
  return role === 'OWNER' ? '/owner' : '/play';
}

export function getSevenReservationsClubPostAuthPath(
  role: SevenReservationsClubRole | null,
): '/onboarding/role' | '/owner' | '/play' {
  if (!role) {
    return '/onboarding/role';
  }

  return getSevenReservationsClubRoleHomePath(role);
}

export function getSevenReservationsClubRoleHint(
  role: SevenReservationsClubRole | null,
  source: SevenReservationsClubRoleSource,
): string {
  if (!role) {
    return 'Selecciona tu rol para continuar.';
  }

  return `Rol actual detectado por ${source}: ${role}`;
}

export function extractSevenReservationsClubRoleFromMePayload(
  payload: unknown,
): SevenReservationsClubRole | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const asRecord = payload as Record<string, unknown>;

  if (isSevenReservationsClubRole(asRecord.role)) {
    return asRecord.role;
  }

  const user = asRecord.user;
  if (user && typeof user === 'object') {
    const role = (user as Record<string, unknown>).role;
    if (isSevenReservationsClubRole(role)) {
      return role;
    }
  }

  return null;
}
