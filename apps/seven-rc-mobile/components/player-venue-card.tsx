import { useRouter } from 'expo-router';
import type { PublicVenue } from '../lib/seven-rc-api';
import { VenueTile } from './venue-tile';

interface PlayerVenueCardProps {
  venue: PublicVenue;
}

/** Venue tile on the player home. Opens the venue sheet (`/venues/[venueId]`, modal route). */
export function PlayerVenueCard({ venue }: PlayerVenueCardProps) {
  const router = useRouter();

  return (
    <VenueTile
      name={venue.name}
      address={venue.address}
      accessibilityHint="Muestra las canchas del complejo"
      onPress={() => router.push(`/venues/${venue.id}`)}
    />
  );
}
