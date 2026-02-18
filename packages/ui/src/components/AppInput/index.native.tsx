import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { suitTheme } from '../../theme';

export interface AppInputProps extends Omit<TextInputProps, 'onChangeText' | 'value' | 'style'> {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  error?: boolean;
  compact?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
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
  secureTextEntry,
  ...rest
}: AppInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const bodyType = suitTheme.typography.styles.body;
  const bodyLineHeight = Math.round(bodyType.fontSize * bodyType.lineHeightRecommended);
  const shouldShowPasswordToggle = Boolean(secureTextEntry && showPasswordToggle);
  const resolvedLabel = label ?? placeholder;
  const inputPaddingLeft = leftIcon ? 40 : suitTheme.sizes.control.inputPaddingX;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputPaddingRight = hasRightAction ? 40 : suitTheme.sizes.control.inputPaddingX;

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
      <View
        style={{
          position: 'relative',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {leftIcon ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: [
                {
                  translateY: -8,
                },
              ],
              zIndex: 1,
            }}
          >
            {leftIcon}
          </View>
        ) : null}
        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          secureTextEntry={shouldShowPasswordToggle ? !isPasswordVisible : secureTextEntry}
          placeholderTextColor={suitTheme.colors.muted}
          style={{
            width: '100%',
            height: compact ? suitTheme.sizes.control.sm : suitTheme.sizes.control.md,
            borderRadius: suitTheme.borderRadius.md,
            borderWidth: 1,
            borderColor: error ? suitTheme.colors.destructive : suitTheme.colors.surface,
            backgroundColor: suitTheme.colors.brandDark,
            color: disabled ? suitTheme.colors.muted : suitTheme.colors.text,
            opacity: disabled ? 0.75 : 1,
            paddingLeft: inputPaddingLeft,
            paddingRight: inputPaddingRight,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
            lineHeight: bodyLineHeight,
            letterSpacing: bodyType.letterSpacingPx,
          }}
        />
        {shouldShowPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: [
                {
                  translateY: -8,
                },
              ],
              zIndex: 1,
            }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color={suitTheme.colors.muted}
            />
          </Pressable>
        ) : null}
        {!shouldShowPasswordToggle && rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: [
                {
                  translateY: -8,
                },
              ],
              zIndex: 1,
            }}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
