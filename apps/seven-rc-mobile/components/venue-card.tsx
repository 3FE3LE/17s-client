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
import { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useAppTheme, GapView } from '@17suit/ui';
import type { OwnerVenue } from '../lib/seven-rc-api';
import { useOwnerVenuePitchesQuery } from '../lib/owner-queries';
import { PitchListItem } from './pitch-list-item';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import logo from '../assets/icon-17suit.png';

interface VenueCardProps {
  venue: OwnerVenue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const overlay = useRef(new Animated.Value(0)).current;

  const pitchesQuery = useOwnerVenuePitchesQuery(expanded ? venue.id : null);

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
          source={logo}
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
                  router.push(`/complexes/${venue.id}`);
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
                  Ver canchas
                </Text>
              </Pressable>
              {pitchesQuery.data && pitchesQuery.data.length > 0 ? (
                <Pressable
                  onPress={() => {
                    setExpanded(false);
                    router.push(`/complexes/${venue.id}/courts/new`);
                  }}
                  style={{
                    marginLeft: 'auto',
                    width: 36,
                    height: 36,
                    borderRadius: theme.borderRadius.full,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.brandPrimary,
                  }}
                >
                  <Feather name="plus" size={18} color={theme.colors.brandDark} />
                </Pressable>
              ) : null}
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
                    <PitchListItem loading />
                    <PitchListItem loading />
                    <PitchListItem loading />
                  </>
                ) : null}
                {!pitchesQuery.isLoading && pitchesQuery.data?.length
                  ? pitchesQuery.data.map((pitch) => <PitchListItem key={pitch.id} pitch={pitch} />)
                  : null}
                {!pitchesQuery.isLoading &&
                (!pitchesQuery.data || pitchesQuery.data.length === 0) ? (
                  <>
                    <Text
                      style={{
                        color: theme.colors.muted,
                        fontFamily: theme.typography.styles.body.nativeFamily,
                        fontSize: theme.typography.styles.body.fontSize,
                        letterSpacing: theme.typography.styles.body.letterSpacingPx,
                      }}
                    >
                      Sin canchas registradas.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setExpanded(false);
                        router.push(`/complexes/${venue.id}/courts/new`);
                      }}
                      style={{
                        marginTop: theme.spacing.sm,
                        borderRadius: theme.borderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.brandPrimary,
                        paddingVertical: theme.spacing.sm,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.brandPrimary,
                          fontFamily: theme.typography.styles.button.nativeFamily,
                          fontSize: theme.typography.styles.button.fontSize,
                          letterSpacing: theme.typography.styles.button.letterSpacingPx,
                        }}
                      >
                        Crear cancha
                      </Text>
                    </Pressable>
                  </>
                ) : null}
              </GapView>
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
