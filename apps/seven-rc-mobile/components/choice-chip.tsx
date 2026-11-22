import { useAppTheme } from '@17suit/ui-native';
import { Pressable, Text } from 'react-native';

interface ChoiceChipProps {
  label: string;
  /** Second line under the label (e.g. a price). */
  caption?: string | null;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  minWidth?: number;
}

/**
 * 44pt selectable chip for short single-choice sets (time slots, turns, days).
 * Render inside a `View accessibilityRole="radiogroup"`.
 */
export function ChoiceChip({
  label,
  caption,
  selected,
  onPress,
  accessibilityLabel,
  minWidth = 76,
}: ChoiceChipProps) {
  const { theme } = useAppTheme();
  const labelType = theme.typography.styles.button;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={accessibilityLabel ?? (caption ? `${label}, ${caption}` : label)}
      style={({ pressed }) => ({
        minHeight: 44,
        minWidth,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: selected ? theme.colors.brandPrimary : theme.grayscale[3],
        backgroundColor: selected ? theme.colors.brandPrimary : theme.colors.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          color: selected ? theme.colors.brandDark : theme.colors.text,
          fontFamily: labelType.nativeFamily,
          fontSize: labelType.fontSize,
          fontVariant: ['tabular-nums'],
        }}
      >
        {label}
      </Text>
      {caption ? (
        <Text
          style={{
            color: selected ? theme.colors.brandDark : theme.colors.muted,
            fontSize: 12,
            lineHeight: 16,
            fontVariant: ['tabular-nums'],
          }}
        >
          {caption}
        </Text>
      ) : null}
    </Pressable>
  );
}
