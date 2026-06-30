import type { ReactNode } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

export interface AppScrollViewProps extends Pick<
  ScrollViewProps,
  | 'style'
  | 'contentContainerStyle'
  | 'refreshControl'
  | 'keyboardShouldPersistTaps'
  | 'showsVerticalScrollIndicator'
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
 * `showsVerticalScrollIndicator`. Behaviour identical to the underlying RN
 * component.
 */
export function AppScrollView({
  children,
  style,
  contentContainerStyle,
  refreshControl,
  keyboardShouldPersistTaps,
  showsVerticalScrollIndicator,
}: AppScrollViewProps) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </ScrollView>
  );
}
