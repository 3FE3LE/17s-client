import type { ReactNode } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

export interface AppScrollViewProps extends Pick<
  ScrollViewProps,
  | 'style'
  | 'contentContainerStyle'
  | 'refreshControl'
  | 'keyboardShouldPersistTaps'
  | 'showsVerticalScrollIndicator'
  | 'horizontal'
  | 'showsHorizontalScrollIndicator'
> {
  children: ReactNode;
}

/**
 * Thin wrapper over the React Native `ScrollView` so the seven-rc-mobile app
 * can avoid importing `ScrollView` directly. `ScrollView` is restricted by
 * the mobile eslint config to keep bridge behaviour centralized.
 *
 * Contract: 1:1 passthrough of `style`, `contentContainerStyle`,
 * `refreshControl`, `keyboardShouldPersistTaps` and
 * `showsVerticalScrollIndicator`, `horizontal` and
 * `showsHorizontalScrollIndicator`. Behaviour identical to the underlying RN
 * component.
 */
export function AppScrollView({
  children,
  style,
  contentContainerStyle,
  refreshControl,
  keyboardShouldPersistTaps,
  showsVerticalScrollIndicator,
  horizontal,
  showsHorizontalScrollIndicator,
}: AppScrollViewProps) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
    >
      {children}
    </ScrollView>
  );
}
