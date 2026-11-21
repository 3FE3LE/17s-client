import { Feather } from '@expo/vector-icons';
import { AppAlert, AppButton, AppEmpty, AppSkeleton, GapView, useAppTheme } from '@17suit/ui';
import { AppScrollView } from '@17suit/ui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { humanizeError } from '../../../lib/error-messages';
import { usePlayerVenuePitchesQuery, usePlayerVenuesQuery } from '../../../lib/player-queries';

/**
 * Venue sheet. Presented as a native modal by `(app)/_layout.tsx`, so iOS
 * swipe-down, Android Back and the close button all dismiss it.
 */
export default function VenueSheetScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
  const venuesQuery = usePlayerVenuesQuery();
  const pitchesQuery = usePlayerVenuePitchesQuery(venueId ?? null);
  const venue = venuesQuery.data?.find((item) => item.id === venueId);
  const venueName = venue?.name ?? 'Complejo';
  const address = venue?.address?.trim().length ? venue.address : 'Dirección pendiente';
  const subtitleType = theme.typography.styles.subtitle1;
  const captionType = theme.typography.styles.caption;
  const bodyType = theme.typography.styles.body;

  const close = () => router.back();
  const book = (pitchId?: string) => {
    router.back();
    router.push({
      pathname: '/reservations/new',
      params: pitchId ? { venueId: venueId ?? '', pitchId } : { venueId: venueId ?? '' },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.md,
        paddingBottom: Math.max(insets.bottom, theme.spacing.md),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            accessibilityRole="header"
            numberOfLines={2}
            style={{
              color: theme.colors.text,
              fontFamily: subtitleType.nativeFamily,
              fontSize: subtitleType.fontSize,
              lineHeight: Math.round(subtitleType.fontSize * subtitleType.lineHeightRecommended),
              letterSpacing: subtitleType.letterSpacingPx,
            }}
          >
            {venueName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.muted,
              fontFamily: captionType.nativeFamily,
              fontSize: captionType.fontSize,
              letterSpacing: captionType.letterSpacingPx,
            }}
          >
            {address}
          </Text>
        </View>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={8}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.borderRadius.full,
            borderWidth: 1,
            borderColor: theme.grayscale[3],
            backgroundColor: theme.colors.surface,
          }}
        >
          <Feather name="x" size={20} color={theme.colors.text} />
        </Pressable>
      </View>

      <AppScrollView
        style={{ flex: 1, marginTop: theme.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
        }}
        refreshControl={
          <RefreshControl
            refreshing={pitchesQuery.isFetching && !pitchesQuery.isLoading}
            onRefresh={() => {
              void pitchesQuery.refetch();
            }}
            tintColor={theme.colors.muted}
          />
        }
      >
        <GapView gap="md">
          {pitchesQuery.isLoading ? (
            <>
              <AppSkeleton height={72} rounded="lg" />
              <AppSkeleton height={72} rounded="lg" />
            </>
          ) : null}

          {pitchesQuery.error ? (
            <AppAlert
              variant="warning"
              title="No pudimos cargar las canchas"
              description={humanizeError(pitchesQuery.error, 'load')}
              action={
                <AppButton
                  variant="warning"
                  onPress={() => {
                    void pitchesQuery.refetch();
                  }}
                >
                  Reintentar
                </AppButton>
              }
            />
          ) : null}

          {!pitchesQuery.isLoading &&
          !pitchesQuery.error &&
          (pitchesQuery.data ?? []).length === 0 ? (
            <AppEmpty
              title="Este complejo aún no tiene canchas"
              description="Vuelve pronto o elige otro complejo."
              icon={<Feather name="grid" size={20} color={theme.colors.brandPrimary} />}
            />
          ) : null}

          {(pitchesQuery.data ?? []).map((pitch) => {
            const detail = `${pitch.sportType ?? 'Multideporte'} · ${pitch.capacity} jugadores · ${pitch.slotDurationMinutes} min por turno`;
            return (
              <Pressable
                key={pitch.id}
                onPress={() => book(pitch.id)}
                accessibilityRole="button"
                accessibilityLabel={`Reservar ${pitch.name}. ${detail}`}
                style={({ pressed }) => ({
                  minHeight: 44,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.grayscale[3],
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.md,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.typography.styles.subtitle2.nativeFamily,
                      fontSize: theme.typography.styles.subtitle2.fontSize,
                      letterSpacing: theme.typography.styles.subtitle2.letterSpacingPx,
                    }}
                  >
                    {pitch.name}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.muted,
                      fontFamily: bodyType.nativeFamily,
                      fontSize: captionType.fontSize,
                      letterSpacing: captionType.letterSpacingPx,
                      marginTop: theme.spacing.xs,
                    }}
                  >
                    {detail}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.muted} />
              </Pressable>
            );
          })}
        </GapView>
      </AppScrollView>

      <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm }}>
        <AppButton onPress={() => book()} disabled={!venueId}>
          Reservar en este complejo
        </AppButton>
      </View>
    </View>
  );
}
