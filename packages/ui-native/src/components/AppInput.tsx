import { inputRecipe } from '@17suit/design-system';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
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
  textContentType?: TextInputProps['textContentType'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCorrect?: boolean;
  accessibilityLabel?: string;
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
  textContentType,
  autoComplete,
  autoCorrect,
  accessibilityLabel,
}: AppInputProps) {
  const { theme } = useAppTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = Boolean(secureTextEntry);
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
  const resolvedLabel = label ?? placeholder;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputClasses = inputRecipe({
    state: error ? 'error' : disabled ? 'disabled' : 'default',
    compact,
    hasLeftAccessory: Boolean(leftIcon),
    hasRightAccessory: hasRightAction,
    platform: 'native',
  });

  return (
    <View className={inputClasses.root}>
      {resolvedLabel ? <Text className={inputClasses.fieldLabel}>{resolvedLabel}</Text> : null}
      <View className="relative w-full">
        {leftIcon ? (
          <View className="absolute left-3 top-1/2 h-5 w-5 -translate-y-[10px] items-center justify-center">
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
          textContentType={textContentType}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          accessibilityLabel={accessibilityLabel ?? resolvedLabel}
          placeholderTextColor={theme.colors.muted}
          className={inputClasses.control}
          style={{
            color: disabled ? theme.colors.muted : theme.colors.text,
          }}
        />
        {shouldShowPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-0 top-1/2 h-11 w-11 -translate-y-[22px] items-center justify-center"
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
            className="absolute right-[10px] top-1/2 h-6 w-6 -translate-y-[12px] items-center justify-center"
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
