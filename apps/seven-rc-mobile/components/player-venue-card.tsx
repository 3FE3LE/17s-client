import { useTranslation } from '@17suit/i18n/react';
import { useRouter } from 'expo-router';
import type { PublicVenue } from '../lib/seven-rc-api';
import { venueRouteParams } from '../lib/venue-params';
import { VenueTile } from './venue-tile';

interface PlayerVenueCardProps {
  venue: PublicVenue;
}

/** Venue tile on the player home. Opens the venue sheet (`/venues/[venueId]`, modal route). */
export function PlayerVenueCard({ venue }: PlayerVenueCardProps) {
  const { t } = useTranslation('mobile');
  const router = useRouter();

  return (
    <VenueTile
      name={venue.name}
      address={venue.address}
      accessibilityHint={t('venueTile.playerHint')}
      onPress={() =>
        router.push({ pathname: '/venues/[venueId]', params: venueRouteParams(venue) })
      }
    />
  );
}
