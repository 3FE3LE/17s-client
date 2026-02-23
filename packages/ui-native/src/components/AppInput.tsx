import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../theme/theme-context';
import { Ionicons } from '@expo/vector-icons';

export interface AppInputProps {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  compact?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  keyboardType?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: string;
}

export function AppInput({
  value,
  onChangeText,
  label,
  placeholder,
  error = false,
  compact = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showPasswordToggle = true,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
}: AppInputProps) {
  const { theme } = useAppTheme();
  const bodyType = theme.typography.styles.body;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = Boolean(secureTextEntry);
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
  const resolvedLabel = label ?? placeholder;
  const inputPaddingLeft = leftIcon ? 40 : theme.sizes.control.inputPaddingX;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputPaddingRight = hasRightAction ? 40 : theme.sizes.control.inputPaddingX;
  const lineHeight = Math.round(bodyType.fontSize * bodyType.lineHeightRecommended);

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
            fontFamily: bodyType.nativeFamily,
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
          position: 'relative',
          width: '100%',
        }}
      >
        {leftIcon ? (
          <View
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: [{ translateY: -10 }],
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              width: 20,
            }}
          >
            {leftIcon}
          </View>
        ) : null}
        <TextInput
          value={value}
          placeholder={placeholder}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onChangeText={onChangeText}
          keyboardType={keyboardType as never}
          autoCapitalize={autoCapitalize as never}
          placeholderTextColor={theme.colors.muted}
          style={{
            height: compact ? theme.sizes.control.sm : theme.sizes.control.md,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: error ? theme.colors.destructive : theme.grayscale[3],
            backgroundColor: theme.colors.surface,
            color: disabled ? theme.colors.muted : theme.colors.text,
            opacity: disabled ? 0.75 : 1,
            paddingLeft: inputPaddingLeft,
            paddingRight: inputPaddingRight,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight,
          }}
        />
        {shouldShowPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: [{ translateY: -12 }],
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={16}
              color={theme.colors.muted}
            />
          </Pressable>
        ) : null}
        {!shouldShowPasswordToggle && rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: [{ translateY: -12 }],
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
