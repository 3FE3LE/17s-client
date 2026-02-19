import { redirect } from 'next/navigation';
import { getSevenReservationsClubPostAuthPath } from '@17suit/module-seven-reservations-club';
import { getCurrentUserRole } from '@/lib/current-user-role';

export default async function HomePage() {
  const { role } = await getCurrentUserRole();
  redirect(getSevenReservationsClubPostAuthPath(role));
}
