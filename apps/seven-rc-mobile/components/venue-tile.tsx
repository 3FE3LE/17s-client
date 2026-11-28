import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from '@17suit/i18n/react';
import { AppBadge, useAppTheme } from '@17suit/ui-native';
import { Pressable, Text, View } from 'react-native';

interface VenueTileProps {
  name: string;
  address?: string | null | undefined;
  /** Extra line under the address, e.g. "3 courts · 12 reservations". */
  meta?: string | null;
  /** Attention badge, e.g. "2 to confirm". */
  badge?: string | null;
  accessibilityHint: string;
  onPress: () => void;
}

/**
 * Venue row shared by owner and player home. A neutral venue glyph stands in
 * for photos: the venue lists carry no sports, which show on each court row.
 */
export function VenueTile({
  name,
  address,
  meta,
  badge,
  accessibilityHint,
  onPress,
}: VenueTileProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation('mobile');
  const addressLabel = address?.trim().length ? address : t('common.pendingAddress');
  const titleType = theme.typography.styles.subtitle2;
  const captionType = theme.typography.styles.caption;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, badge, addressLabel, meta].filter(Boolean).join(', ')}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => ({
        width: '100%',
        minHeight: 88,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.grayscale[3],
        backgroundColor: theme.colors.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${theme.colors.brandPrimary}22`,
        }}
      >
        <MaterialCommunityIcons name="stadium-variant" size={30} color={theme.colors.text} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.text,
            fontFamily: titleType.nativeFamily,
            fontSize: titleType.fontSize,
            lineHeight: Math.round(titleType.fontSize * titleType.lineHeightRecommended),
            letterSpacing: titleType.letterSpacingPx,
          }}
        >
          {name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Feather name="map-pin" size={14} color={theme.colors.muted} />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: theme.colors.muted,
              fontFamily: captionType.nativeFamily,
              fontSize: captionType.fontSize,
              letterSpacing: captionType.letterSpacingPx,
            }}
          >
            {addressLabel}
          </Text>
        </View>
        {badge ? <AppBadge variant="warning">{badge}</AppBadge> : null}
        {meta ? (
          <Text
            style={{
              color: theme.colors.muted,
              fontFamily: captionType.nativeFamily,
              fontSize: captionType.fontSize,
              letterSpacing: captionType.letterSpacingPx,
              fontVariant: ['tabular-nums'],
            }}
          >
            {meta}
          </Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={20} color={theme.colors.muted} />
    </Pressable>
  );
}
