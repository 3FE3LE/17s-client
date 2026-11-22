import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@17suit/ui-native';
import { Pressable, Text } from 'react-native';
import { callPhone, hasDialablePhone, openMaps } from '../lib/links';

interface LinkRowProps {
  icon: 'map-pin' | 'phone';
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}

function LinkRow({ icon, label, accessibilityLabel, onPress }: LinkRowProps) {
  const { theme } = useAppTheme();
  const type = theme.typography.styles.body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Feather name={icon} size={18} color={theme.colors.info} />
      <Text
        style={{
          flex: 1,
          color: theme.colors.info,
          fontFamily: type.nativeFamily,
          fontSize: type.fontSize,
          textDecorationLine: 'underline',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Address (opens maps) and phone (opens the dialer), each only when the venue has one. */
export function VenueLinks({
  address,
  phone,
}: {
  address?: string | null | undefined;
  phone?: string | null | undefined;
}) {
  const place = address?.trim();
  return (
    <>
      {place ? (
        <LinkRow
          icon="map-pin"
          label={place}
          accessibilityLabel={`${place}. Abrir en mapas`}
          onPress={() => void openMaps(place)}
        />
      ) : null}
      {hasDialablePhone(phone) ? (
        <LinkRow
          icon="phone"
          label={`Llamar al complejo: ${phone}`}
          accessibilityLabel={`Llamar al complejo, ${phone}`}
          onPress={() => void callPhone(phone)}
        />
      ) : null}
    </>
  );
}
