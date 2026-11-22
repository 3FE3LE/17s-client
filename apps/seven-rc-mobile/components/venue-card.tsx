import { useRouter } from 'expo-router';
import type { OwnerVenue } from '../lib/seven-rc-api';
import { VenueTile } from './venue-tile';

interface VenueCardProps {
  venue: OwnerVenue;
}

/**
 * Owner's complex tile. Pushes the complex detail screen (courts + reservations)
 * on the native stack instead of opening an overlay, so Back/swipe-back work.
 */
export function VenueCard({ venue }: VenueCardProps) {
  const router = useRouter();
  const pitches = venue._count?.pitches ?? 0;
  const reservations = venue._count?.reservations ?? 0;
  const countsLabel = `${pitches} ${pitches === 1 ? 'cancha' : 'canchas'} · ${reservations} ${
    reservations === 1 ? 'reserva' : 'reservas'
  }`;

  return (
    <VenueTile
      name={venue.name}
      address={venue.address}
      meta={countsLabel}
      accessibilityHint="Abre las canchas y reservas del complejo"
      onPress={() => router.push(`/complexes/${venue.id}`)}
    />
  );
}
