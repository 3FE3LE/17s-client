import { useRef, type ComponentRef, type PropsWithChildren } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/theme-context';
import { AppTitle } from './AppTitle';
import { withGap } from '../utils/withGap';
import { AppLanguageSelect } from './AppLanguageSelect';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  onBack?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  /**
   * iOS: inset the scroll content for the keyboard. Pass `false` when a parent
   * `KeyboardAvoidingView` already resizes the frame, or the space is added
   * twice; the frame then scrolls the focused field into view when it shrinks.
   */
  automaticallyAdjustKeyboardInsets?: boolean;
  /** Show the language picker below the content (home and sign-in screens). */
  showLanguageSelect?: boolean;
}

export function AppFrame({
  appName,
  subtitle,
  onBack,
  onRefresh,
  refreshing = false,
  automaticallyAdjustKeyboardInsets = true,
  showLanguageSelect = false,
  children,
}: AppFrameProps) {
  const { theme } = useAppTheme();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const contentRef = useRef<ComponentRef<typeof View>>(null);
  const scrollOffset = useRef(0);
  const frameHeight = useRef(0);

  const revealFocusedInput = ({ nativeEvent }: LayoutChangeEvent) => {
    const height = nativeEvent.layout.height;
    const shrank = height < frameHeight.current;
    frameHeight.current = height;
    if (automaticallyAdjustKeyboardInsets || !shrank) return;

    const input = TextInput.State.currentlyFocusedInput();
    const content = contentRef.current;
    if (!input || !content) return;
    input.measureLayout(content, (_x, y, _width, inputHeight) => {
      // `content` starts after the container padding; leave the same gap below the field.
      const fieldBottom = y + inputHeight + 2 * theme.spacing.lg;
      if (fieldBottom > scrollOffset.current + height) {
        scrollRef.current?.scrollTo({ y: fieldBottom - height });
      }
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={revealFocusedInput}
      onScroll={({ nativeEvent }) => {
        scrollOffset.current = nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={100}
      automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.x2l,
        flexGrow: 1,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.muted}
          />
        ) : undefined
      }
      keyboardShouldPersistTaps="handled"
    >
      <View ref={contentRef} collapsable={false} className="w-full">
        {typeof onBack === 'function' ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center self-start rounded-md border border-black/20 bg-surface"
          >
            <Feather name="chevron-left" size={20} color={theme.colors.text} />
          </Pressable>
        ) : null}
        <AppTitle text={appName} />
        {subtitle ? (
          <Text className="font-zilla text-md leading-[24px] tracking-normal text-muted">
            {subtitle}
          </Text>
        ) : null}
        <View style={{ marginTop: theme.spacing.lg }}>{withGap(children, theme.spacing.md)}</View>
        {showLanguageSelect ? (
          <View style={{ marginTop: theme.spacing.lg }}>
            <AppLanguageSelect />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
