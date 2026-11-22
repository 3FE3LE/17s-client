import { AccessibilityInfo, Alert, Platform, ToastAndroid } from 'react-native';

/**
 * Action feedback. `useAppToast` from `@17suit/ui` is a no-op on native, so
 * failures used to be invisible. Errors that block get an Alert; successes are
 * visible on screen already, so they get a short toast (Android) or a screen
 * reader announcement (iOS).
 */
export const feedback = {
  success(title: string, message?: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message ? `${title}. ${message}` : title, ToastAndroid.SHORT);
      return;
    }
    AccessibilityInfo.announceForAccessibility(message ? `${title}. ${message}` : title);
  },
  error(title: string, message: string) {
    if (Platform.OS === 'web') {
      (globalThis as { alert?: (text: string) => void }).alert?.(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  },
};
