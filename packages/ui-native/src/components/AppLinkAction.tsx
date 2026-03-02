import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';

export interface AppLinkActionProps extends PropsWithChildren {
  onPress?: () => void;
}

export function AppLinkAction({ children, onPress }: AppLinkActionProps) {
  return (
    <Pressable onPress={onPress}>
      <Text className="py-xs text-left font-zilla text-md leading-[24px] tracking-normal text-info">
        {children}
      </Text>
    </Pressable>
  );
}
