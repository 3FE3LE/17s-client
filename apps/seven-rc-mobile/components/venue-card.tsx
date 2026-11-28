import { useTranslation } from '@17suit/i18n/react';
import { useRouter } from 'expo-router';
import type { OwnerVenue } from '../lib/seven-rc-api';
import { VenueTile } from './venue-tile';

interface VenueCardProps {
  venue: OwnerVenue;
  /** Pending requests the owner can still confirm. */
  pendingCount?: number;
}

/**
 * Owner's complex tile. Pushes the complex detail screen (courts + reservations)
 * on the native stack instead of opening an overlay, so Back/swipe-back work.
 */
export function VenueCard({ venue, pendingCount = 0 }: VenueCardProps) {
  const { t } = useTranslation('mobile');
  const router = useRouter();
  const pitches = venue._count?.pitches ?? 0;
  const reservations = venue._count?.reservations ?? 0;
  const countsLabel = t('venueTile.counts', {
    courts: t('venueTile.courts', { count: pitches }),
    reservations: t('venueTile.reservations', { count: reservations }),
  });

  return (
    <VenueTile
      name={venue.name}
      address={venue.address}
      meta={countsLabel}
      badge={pendingCount > 0 ? t('venueTile.pending', { count: pendingCount }) : null}
      accessibilityHint={t('venueTile.ownerHint')}
      onPress={() => router.push(`/complexes/${venue.id}`)}
    />
  );
}
