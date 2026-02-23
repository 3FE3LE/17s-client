import {
  Animated,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useAppTheme, GapView } from '@17suit/ui';
import type { PublicVenue } from '../lib/seven-rc-api';
import { usePlayerVenuePitchesQuery } from '../lib/player-queries';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface PlayerVenueCardProps {
  venue: PublicVenue;
}

export function PlayerVenueCard({ venue }: PlayerVenueCardProps) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const overlay = useRef(new Animated.Value(0)).current;
  const image = useMemo(() => require('../assets/icon-17suit.png'), []);

  const pitchesQuery = usePlayerVenuePitchesQuery(expanded ? venue.id : null);

  useEffect(() => {
    Animated.timing(overlay, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded, overlay]);

  const overlayOpacity = overlay.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const overlayScale = overlay.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  const addressLabel = venue.address?.trim().length ? venue.address : 'Direccion pendiente';

  return (
    <>
      <Pressable
        onPress={() => setExpanded(true)}
        style={{
          width: '100%',
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.grayscale[3],
          overflow: 'hidden',
        }}
      >
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={{
            width: '100%',
            minHeight: 160,
            justifyContent: 'flex-end',
          }}
          imageStyle={{ opacity: 0.25 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
            style={{ padding: theme.spacing.md }}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: theme.typography.styles.subtitle2.nativeFamily,
                fontSize: theme.typography.styles.subtitle2.fontSize,
                letterSpacing: theme.typography.styles.subtitle2.letterSpacingPx,
              }}
            >
              {venue.name}
            </Text>
            <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="map-pin" size={14} color="#ffffffcc" />
              <Text
                style={{
                  color: '#ffffffcc',
                  fontFamily: theme.typography.styles.caption.nativeFamily,
                  fontSize: theme.typography.styles.caption.fontSize,
                  letterSpacing: theme.typography.styles.caption.letterSpacingPx,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {addressLabel}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>

      <Modal visible={expanded} transparent animationType="none">
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            opacity: overlayOpacity,
            transform: [{ scale: overlayScale }],
          }}
        >
          <View style={{ flex: 1, padding: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
              <Pressable
                onPress={() => setExpanded(false)}
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.grayscale[3],
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Feather name="x" size={18} color={theme.colors.text} />
              </Pressable>
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.styles.subtitle1.nativeFamily,
                  fontSize: theme.typography.styles.subtitle1.fontSize,
                  letterSpacing: theme.typography.styles.subtitle1.letterSpacingPx,
                }}
              >
                {venue.name}
              </Text>
              <Pressable
                onPress={() => {
                  setExpanded(false);
                  router.push({
                    pathname: '/reservations/new',
                    params: { venueId: venue.id },
                  });
                }}
                style={{
                  marginLeft: 'auto',
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.grayscale[3],
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.styles.button.nativeFamily,
                    fontSize: theme.typography.styles.button.fontSize - 1,
                    letterSpacing: theme.typography.styles.button.letterSpacingPx,
                  }}
                >
                  Reservar
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={{ marginTop: theme.spacing.lg }}
              refreshControl={
                <RefreshControl
                  refreshing={pitchesQuery.isFetching}
                  onRefresh={() => {
                    void pitchesQuery.refetch();
                  }}
                  tintColor={theme.colors.brandPrimary}
                />
              }
            >
              <GapView gap="md">
                {pitchesQuery.isLoading ? (
                  <>
                    <View
                      style={{
                        height: 64,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.grayscale[4],
                      }}
                    />
                    <View
                      style={{
                        height: 64,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.grayscale[4],
                      }}
                    />
                  </>
                ) : null}
                {!pitchesQuery.isLoading && pitchesQuery.data?.length
                  ? pitchesQuery.data.map((pitch) => (
                      <Pressable
                        key={pitch.id}
                        onPress={() => {
                          setExpanded(false);
                          router.push({
                            pathname: '/reservations/new',
                            params: { venueId: venue.id, pitchId: pitch.id },
                          });
                        }}
                        style={{
                          borderRadius: theme.borderRadius.md,
                          borderWidth: 1,
                          borderColor: theme.grayscale[3],
                          backgroundColor: theme.colors.surface,
                          padding: theme.spacing.md,
                        }}
                      >
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
                            fontFamily: theme.typography.styles.caption.nativeFamily,
                            fontSize: theme.typography.styles.caption.fontSize,
                            letterSpacing: theme.typography.styles.caption.letterSpacingPx,
                            marginTop: theme.spacing.xs,
                          }}
                        >
                          {`${pitch.sportType ?? 'multi'} · ${pitch.capacity} jugadores · ${pitch.slotDurationMinutes} min`}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.brandPrimary,
                            fontFamily: theme.typography.styles.button.nativeFamily,
                            fontSize: theme.typography.styles.button.fontSize - 1,
                            letterSpacing: theme.typography.styles.button.letterSpacingPx,
                            marginTop: theme.spacing.sm,
                          }}
                        >
                          Reservar esta cancha
                        </Text>
                      </Pressable>
                    ))
                  : null}
                {!pitchesQuery.isLoading &&
                (!pitchesQuery.data || pitchesQuery.data.length === 0) ? (
                  <Text
                    style={{
                      color: theme.colors.muted,
                      fontFamily: theme.typography.styles.body.nativeFamily,
                      fontSize: theme.typography.styles.body.fontSize,
                      letterSpacing: theme.typography.styles.body.letterSpacingPx,
                    }}
                  >
                    No hay canchas disponibles en este complejo.
                  </Text>
                ) : null}
              </GapView>
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
