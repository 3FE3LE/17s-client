import { Alert, Platform } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

/**
 * Native destructive-action confirm. `Alert.alert` is a no-op on
 * react-native-web, so the web build falls back to `window.confirm`.
 */
export function confirmDestructive(
  { title, message, confirmText, cancelText }: ConfirmOptions,
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    const confirmFn = (globalThis as { confirm?: (text: string) => boolean }).confirm;
    if (confirmFn?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

/**
 * Native confirm for a non-destructive action that cannot be undone (e.g.
 * confirming a booking). Same web fallback as {@link confirmDestructive}.
 */
export function confirmAction(
  { title, message, confirmText, cancelText }: ConfirmOptions,
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    const confirmFn = (globalThis as { confirm?: (text: string) => boolean }).confirm;
    if (confirmFn?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, onPress: onConfirm },
  ]);
}
