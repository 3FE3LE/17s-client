import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '../theme/theme-context';

export interface AppSelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps {
  value: string;
  onChangeValue: (value: string) => void;
  options: AppSelectOption[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  header?: ReactNode;
}

export function AppSelect({
  value,
  onChangeValue,
  options,
  label,
  placeholder = 'Seleccionar',
  error = false,
  disabled = false,
  header,
}: AppSelectProps) {
  const { theme } = useAppTheme();
  const bodyType = theme.typography.styles.body;
  const captionType = theme.typography.styles.caption;
  const resolvedLabel = label ?? placeholder;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  if (value.trim().length > 0 && selectedOption === null) {
    throw new Error(`[AppSelect] Received value "${value}" that is not present in options.`);
  }

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      {resolvedLabel ? (
        <Text
          style={{
            color: theme.colors.muted,
            fontFamily: captionType.nativeFamily,
            fontSize: theme.fontSizes.sm,
            lineHeight: Math.round(theme.fontSizes.sm * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
            marginBottom: theme.spacing.xs,
          }}
        >
          {resolvedLabel}
        </Text>
      ) : null}

      <View
        style={{
          minHeight: theme.sizes.control.md,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: error ? theme.colors.destructive : theme.grayscale[3],
          backgroundColor: theme.colors.surface,
          paddingHorizontal: theme.sizes.control.inputPaddingX,
          justifyContent: 'center',
          opacity: disabled ? 0.75 : 1,
        }}
      >
        <Picker
          selectedValue={value}
          enabled={!disabled}
          onValueChange={(itemValue) => onChangeValue(String(itemValue))}
          style={{
            color: selectedOption ? theme.colors.text : theme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
          }}
          dropdownIconColor={theme.colors.muted}
        >
          <Picker.Item label={placeholder} value="" enabled={false} />
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {header ? <View style={{ marginTop: theme.spacing.xs }}>{header}</View> : null}
    </View>
  );
}
