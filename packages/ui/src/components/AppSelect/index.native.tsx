import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, Text, View } from 'react-native';
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
  const [mounted, setMounted] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scrollTranslateY = useRef(new Animated.Value(0)).current;
  const dragStartOffset = useRef(0);
  const scrollOffsetRef = useRef(0);
  const didDragRef = useRef(false);
  const lastDragAtRef = useRef(0);
  const bodyType = suitTheme.typography.styles.body;
  const captionType = suitTheme.typography.styles.caption;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  if (value.trim().length > 0 && selectedOption === null) {
    throw new Error(`[AppSelect] Received value "${value}" that is not present in options.`);
  }

  const resolvedLabel = label ?? placeholder;
  const displayValue = selectedOption?.label ?? placeholder;
  const optionHeight = suitTheme.sizes.control.md;
  const headerHeight = 34;
  const maxVisibleOptions = 6;
  const optionsContentHeight = options.length * optionHeight;
  const optionsViewportHeight = Math.min(optionsContentHeight, optionHeight * maxVisibleOptions);
  const maxOffset = Math.max(0, optionsContentHeight - optionsViewportHeight);
  const panelContentHeight = optionsViewportHeight + headerHeight + suitTheme.spacing.xs * 2;
  const maxDropdownHeight = Math.max(0, panelContentHeight);

  const clampOffset = (nextOffset: number) => Math.max(0, Math.min(nextOffset, maxOffset));
  const applyScrollOffset = (nextOffset: number) => {
    const clamped = clampOffset(nextOffset);
    scrollOffsetRef.current = clamped;
    scrollTranslateY.setValue(-clamped);
  };

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 190,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      return;
    }

    Animated.timing(animation, {
      toValue: 0,
      duration: 120,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [animation, open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    if (selectedIndex < 0) return;
    const preferredOffset = selectedIndex * optionHeight - optionHeight * 2;
    applyScrollOffset(preferredOffset);
  }, [open, optionHeight, options, value]);

  useEffect(() => {
    applyScrollOffset(scrollOffsetRef.current);
  }, [maxOffset]);

  const optionsPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          Math.abs(gestureState.dy) > 4 && maxOffset > 0,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 4 && maxOffset > 0,
        onPanResponderGrant: () => {
          dragStartOffset.current = scrollOffsetRef.current;
          didDragRef.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
          if (Math.abs(gestureState.dy) > 6) {
            didDragRef.current = true;
            lastDragAtRef.current = Date.now();
          }
          const nextOffset = dragStartOffset.current - gestureState.dy;
          applyScrollOffset(nextOffset);
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [maxOffset],
  );

  const chevronRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const panelOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const panelTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });
  const panelMaxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxDropdownHeight],
  });

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
          borderColor: open
            ? suitTheme.colors.accent
            : error
              ? suitTheme.colors.destructive
              : suitTheme.colors.surface,
          backgroundColor: suitTheme.colors.brandDark,
          opacity: disabled ? 0.75 : 1,
          paddingHorizontal: suitTheme.sizes.control.inputPaddingX,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000000',
          shadowOpacity: open ? 0.25 : 0.1,
          shadowRadius: open ? 10 : 4,
          shadowOffset: { width: 0, height: open ? 6 : 2 },
          elevation: open ? 5 : 2,
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
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Ionicons
            name="chevron-down"
            size={16}
            color={open ? suitTheme.colors.accent : suitTheme.colors.muted}
          />
        </Animated.View>
      </Pressable>

      {mounted ? (
        <Animated.View
          style={{
            borderRadius: suitTheme.borderRadius.lg,
            borderWidth: 1,
            borderColor: suitTheme.colors.accent,
            backgroundColor: suitTheme.colors.brandDark,
            overflow: 'hidden',
            opacity: panelOpacity,
            transform: [{ translateY: panelTranslateY }],
            maxHeight: panelMaxHeight,
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          }}
        >
          <View
            style={{
              paddingHorizontal: suitTheme.spacing.md,
              paddingVertical: suitTheme.spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: suitTheme.colors.surface,
              backgroundColor: '#0a2633',
            }}
          >
            <Text
              style={{
                color: suitTheme.colors.muted,
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
              paddingHorizontal: suitTheme.spacing.xs,
              height: optionsViewportHeight + suitTheme.spacing.xs * 2,
              overflow: 'hidden',
            }}
            {...optionsPanResponder.panHandlers}
          >
            <Animated.View
              style={{
                transform: [{ translateY: scrollTranslateY }],
              }}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      if (didDragRef.current || Date.now() - lastDragAtRef.current < 120) {
                        return;
                      }
                      onChangeValue(option.value);
                      setOpen(false);
                    }}
                    style={{
                      height: suitTheme.sizes.control.md,
                      paddingHorizontal: suitTheme.spacing.md,
                      borderRadius: suitTheme.borderRadius.md,
                      borderWidth: isSelected ? 1 : 0,
                      borderColor: isSelected ? suitTheme.colors.accent : 'transparent',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#123343' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? '#e8f7ff' : suitTheme.colors.text,
                        fontFamily: isSelected
                          ? suitTheme.typography.styles.button.nativeFamily
                          : bodyType.nativeFamily,
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
            </Animated.View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
