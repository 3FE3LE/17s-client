import type { ReactNode } from 'react';
import { Modal, View, type ModalProps } from 'react-native';

export interface AppModalProps extends Pick<ModalProps, 'transparent' | 'animationType'> {
  visible: boolean;
  children: ReactNode;
}

/**
 * Thin wrapper over the React Native `Modal` so the seven-rc-mobile app can
 * avoid importing `Modal` directly. `Modal` is restricted by the mobile
 * eslint config so callers stay decoupled from RN's bridge implementation.
 *
 * Contract: behaviour identical to a transparent React Native `Modal` with
 * no animation (`animationType="none"` by default).
 */
export function AppModal({
  visible,
  transparent = true,
  animationType = 'none',
  children,
}: AppModalProps) {
  return (
    <Modal visible={visible} transparent={transparent} animationType={animationType}>
      <View style={{ flex: 1 }}>{children}</View>
    </Modal>
  );
}
