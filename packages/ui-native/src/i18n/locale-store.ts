import { LOCALE_STORAGE_KEY, isLocale, resolveLocale, type Locale } from '@17suit/i18n';
import * as SecureStore from 'expo-secure-store';

/** Device language tags, most preferred first. Hermes `Intl` reflects the OS language. */
function detectDeviceLocales(): string[] {
  try {
    return [Intl.DateTimeFormat().resolvedOptions().locale];
  } catch {
    return [];
  }
}

let current: Locale = resolveLocale({ profile: 'product', detected: detectDeviceLocales() });
const listeners = new Set<() => void>();

function emit(next: Locale) {
  if (next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}

// Saved preference beats the device language. Read once at startup; until it
// resolves the device language is used, so there is no blocking screen.
void SecureStore.getItemAsync(LOCALE_STORAGE_KEY)
  .then((saved) => {
    if (isLocale(saved)) emit(saved);
  })
  .catch(() => undefined);

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLocale(): Locale {
  return current;
}

/** Saves the choice (secure-store) and switches the UI immediately. */
export function setLocale(next: Locale): void {
  emit(next);
  void SecureStore.setItemAsync(LOCALE_STORAGE_KEY, next).catch(() => undefined);
}
