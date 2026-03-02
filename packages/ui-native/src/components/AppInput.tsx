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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = Boolean(secureTextEntry);
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
  const resolvedLabel = label ?? placeholder;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputClassName = [
    'w-full rounded-md border bg-surface font-zilla text-md leading-[24px] text-text',
    compact ? 'h-10' : 'h-11',
    error ? 'border-destructive' : 'border-black/20',
    leftIcon ? 'pl-10' : 'pl-3',
    hasRightAction ? 'pr-10' : 'pr-3',
    disabled ? 'opacity-75' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View className="w-full">
      {resolvedLabel ? (
        <Text className="mb-xs font-zilla text-sm leading-[21px] text-muted">{resolvedLabel}</Text>
      ) : null}
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
          placeholderTextColor={theme.colors.muted}
          className={inputClassName}
          style={{
            color: disabled ? theme.colors.muted : theme.colors.text,
          }}
        />
        {shouldShowPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            className="absolute right-[10px] top-1/2 h-6 w-6 -translate-y-[12px] items-center justify-center"
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
