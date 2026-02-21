import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { suitTheme } from '../../theme';

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
}

export function AppSelect({
  value,
  onChangeValue,
  options,
  label,
  placeholder = 'Seleccionar',
  error = false,
  disabled = false,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const bodyType = suitTheme.typography.styles.body;
  const captionType = suitTheme.typography.styles.caption;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const resolvedLabel = label ?? placeholder;
  const displayValue = selectedOption?.label ?? placeholder;

  return (
    <View
      style={{
        width: '100%',
        gap: suitTheme.spacing.xs,
      }}
    >
      {resolvedLabel ? (
        <Text
          style={{
            color: suitTheme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: suitTheme.fontSizes.sm,
            lineHeight: Math.round(suitTheme.fontSizes.sm * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
          }}
        >
          {resolvedLabel}
        </Text>
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={{
          width: '100%',
          minHeight: suitTheme.sizes.control.md,
          borderRadius: suitTheme.borderRadius.md,
          borderWidth: 1,
          borderColor: error ? suitTheme.colors.destructive : suitTheme.colors.surface,
          backgroundColor: suitTheme.colors.brandDark,
          opacity: disabled ? 0.75 : 1,
          paddingHorizontal: suitTheme.sizes.control.inputPaddingX,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            color: selectedOption ? suitTheme.colors.text : suitTheme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
            letterSpacing: bodyType.letterSpacingPx,
            flex: 1,
            paddingRight: suitTheme.spacing.sm,
          }}
          numberOfLines={1}
        >
          {displayValue}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={suitTheme.colors.muted}
        />
      </Pressable>

      {open ? (
        <View
          style={{
            borderRadius: suitTheme.borderRadius.lg,
            borderWidth: 1,
            borderColor: suitTheme.colors.surface,
            backgroundColor: suitTheme.colors.background,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              paddingHorizontal: suitTheme.spacing.md,
              paddingVertical: suitTheme.spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: suitTheme.colors.surface,
            }}
          >
            <Text
              style={{
                color: suitTheme.colors.text,
                fontFamily: captionType.nativeFamily,
                fontSize: captionType.fontSize,
                lineHeight: Math.round(captionType.fontSize * captionType.lineHeightRecommended),
                letterSpacing: captionType.letterSpacingPx,
              }}
            >
              {resolvedLabel}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: suitTheme.spacing.xs,
              maxHeight: 280,
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChangeValue(option.value);
                    setOpen(false);
                  }}
                  style={{
                    minHeight: suitTheme.sizes.control.md,
                    paddingHorizontal: suitTheme.spacing.md,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected ? suitTheme.colors.surface : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: suitTheme.colors.text,
                      fontFamily: bodyType.nativeFamily,
                      fontSize: bodyType.fontSize,
                      lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
                      letterSpacing: bodyType.letterSpacingPx,
                      flex: 1,
                    }}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={16} color={suitTheme.colors.success} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
