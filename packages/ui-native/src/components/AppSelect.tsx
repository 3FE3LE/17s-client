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
  const resolvedLabel = label ?? placeholder;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  if (value.trim().length > 0 && selectedOption === null) {
    throw new Error(`[AppSelect] Received value "${value}" that is not present in options.`);
  }

  return (
    <View className="w-full">
      {resolvedLabel ? (
        <Text className="mb-xs font-zilla text-sm leading-[21px] text-muted">{resolvedLabel}</Text>
      ) : null}

      <View
        className={`min-h-11 justify-center rounded-md border bg-surface px-3 ${
          error ? 'border-destructive' : 'border-black/20'
        } ${disabled ? 'opacity-75' : ''}`}
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

      {header ? <View className="mt-xs">{header}</View> : null}
    </View>
  );
}
