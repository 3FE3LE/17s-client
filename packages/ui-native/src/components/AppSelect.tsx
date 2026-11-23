import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  /**
   * Show a search field in the sheet. Defaults to `true` when there are more
   * than {@link SEARCH_THRESHOLD} options.
   */
  searchable?: boolean;
  searchPlaceholder?: string;
}

const SEARCH_THRESHOLD = 12;
const ROW_HEIGHT = 48;

/** Lowercase + strip diacritics so "bogota" matches "Bogotá". */
function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/**
 * Pressable field that opens a bottom sheet with the options. Replaces the
 * platform picker (iOS rendered a ~216pt inline wheel). A `value` that is not
 * among `options` (e.g. seeded before the options load) shows the placeholder.
 */
export function AppSelect({
  value,
  onChangeValue,
  options,
  label,
  placeholder = 'Seleccionar',
  error = false,
  disabled = false,
  header,
  searchable,
  searchPlaceholder = 'Buscar',
}: AppSelectProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bodyType = theme.typography.styles.body;
  const titleType = theme.typography.styles.subtitle2;
  const resolvedLabel = label ?? placeholder;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isSearchable = searchable ?? options.length > SEARCH_THRESHOLD;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const needle = normalizeSearch(query);
    if (!isSearchable || needle.length === 0) return options;
    return options.filter(
      (option) =>
        normalizeSearch(option.label).includes(needle) ||
        normalizeSearch(option.value).includes(needle),
    );
  }, [isSearchable, options, query]);

  const selectedIndex = filteredOptions.findIndex((option) => option.value === value);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const select = (next: string) => {
    onChangeValue(next);
    close();
  };

  const fieldText = selectedOption?.label ?? placeholder;

  return (
    <View className="w-full">
      {resolvedLabel ? (
        <Text className="mb-xs font-zilla text-sm leading-[21px] text-muted">{resolvedLabel}</Text>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${resolvedLabel}: ${fieldText}`}
        accessibilityHint="Abre la lista de opciones"
        accessibilityState={{ disabled, expanded: open }}
        className={`min-h-11 flex-row items-center gap-sm rounded-[var(--radius-control)] border bg-surface px-3 ${
          error ? 'border-destructive' : 'border-border-strong'
        } ${disabled ? 'opacity-75' : ''}`}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: selectedOption ? theme.colors.text : theme.colors.muted,
            fontFamily: bodyType.nativeFamily,
            fontSize: bodyType.fontSize,
          }}
        >
          {fieldText}
        </Text>
        <Feather name="chevron-down" size={18} color={theme.colors.muted} />
      </Pressable>

      {header ? <View className="mt-xs">{header}</View> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Cerrar lista"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
            }}
          />
          <View
            accessibilityViewIsModal
            style={{
              maxHeight: '80%',
              ...(isSearchable ? { height: '80%' } : {}),
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.borderRadius.lg,
              borderTopRightRadius: theme.borderRadius.lg,
              paddingTop: theme.spacing.sm,
              paddingBottom: Math.max(insets.bottom, theme.spacing.md),
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: -4 },
              elevation: 12,
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.grayscale[3],
                marginBottom: theme.spacing.sm,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: theme.spacing.lg,
                paddingRight: theme.spacing.sm,
              }}
            >
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                style={{
                  flex: 1,
                  color: theme.colors.text,
                  fontFamily: titleType.nativeFamily,
                  fontSize: titleType.fontSize,
                  letterSpacing: titleType.letterSpacingPx,
                }}
              >
                {resolvedLabel}
              </Text>
              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="x" size={20} color={theme.colors.text} />
              </Pressable>
            </View>

            {isSearchable ? (
              <View
                style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm }}
              >
                <View
                  style={{
                    minHeight: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    borderRadius: theme.borderRadius.md,
                    borderWidth: 1,
                    borderColor: theme.grayscale[3],
                    backgroundColor: theme.colors.surface,
                    paddingHorizontal: theme.spacing.sm,
                  }}
                >
                  <Feather name="search" size={16} color={theme.colors.muted} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={theme.colors.muted}
                    accessibilityLabel={searchPlaceholder}
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    style={{
                      flex: 1,
                      minHeight: 44,
                      color: theme.colors.text,
                      fontFamily: bodyType.nativeFamily,
                      fontSize: bodyType.fontSize,
                    }}
                  />
                </View>
              </View>
            ) : null}

            <FlatList
              data={filteredOptions}
              keyExtractor={(option) => option.value}
              keyboardShouldPersistTaps="handled"
              accessibilityRole="radiogroup"
              getItemLayout={(_data, index) => ({
                length: ROW_HEIGHT,
                offset: ROW_HEIGHT * index,
                index,
              })}
              {...(selectedIndex > 3 ? { initialScrollIndex: selectedIndex - 2 } : {})}
              initialNumToRender={20}
              ListEmptyComponent={
                <Text
                  style={{
                    color: theme.colors.muted,
                    fontFamily: bodyType.nativeFamily,
                    fontSize: bodyType.fontSize,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                  }}
                >
                  Sin resultados
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => select(item.value)}
                    accessibilityRole="radio"
                    accessibilityLabel={item.label}
                    accessibilityState={{ selected: isSelected, checked: isSelected }}
                    style={({ pressed }) => ({
                      height: ROW_HEIGHT,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.sm,
                      paddingHorizontal: theme.spacing.lg,
                      backgroundColor: pressed ? theme.colors.surface : 'transparent',
                    })}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        color: theme.colors.text,
                        fontFamily: isSelected ? titleType.nativeFamily : bodyType.nativeFamily,
                        fontSize: bodyType.fontSize,
                      }}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Feather name="check" size={20} color={theme.colors.info} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
