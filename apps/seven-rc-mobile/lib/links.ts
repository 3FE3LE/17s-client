import { Linking, Platform } from 'react-native';
import { feedback } from './feedback';
import type { MobileT } from './i18n';

async function openFirst(urls: string[], t: MobileT) {
  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return true;
    } catch {
      // Try the next scheme (e.g. no maps app installed -> web maps).
    }
  }
  feedback.error(t('links.openFailedTitle'), t('links.openFailedMessage'));
  return false;
}

/** Opens the platform maps app on `address`, falling back to Google Maps on the web. */
export function openMaps(address: string, t: MobileT) {
  const query = encodeURIComponent(address);
  const web = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const native =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?q=${query}`
      : Platform.OS === 'android'
        ? `geo:0,0?q=${query}`
        : web;
  return openFirst(native === web ? [web] : [native, web], t);
}

/** Digits only, keeping a leading `+` for the dialer. */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

export function hasDialablePhone(phone?: string | null): phone is string {
  return Boolean(phone && phone.replace(/\D/g, '').length >= 7);
}

export function callPhone(phone: string, t: MobileT) {
  return openFirst([`tel:${normalizePhone(phone)}`], t);
}

/** WhatsApp click-to-chat. `wa.me` needs the full international number, digits only. */
export function openWhatsApp(phone: string, t: MobileT) {
  const digits = phone.replace(/\D/g, '');
  return openFirst([`https://wa.me/${digits}`], t);
}
