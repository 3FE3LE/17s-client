import type { Metadata } from 'next';
import { getSiteUrl } from './site-url';

export const siteIcons: Metadata['icons'] = {
  icon: [
    { url: '/icon-17suit.ico', type: 'image/x-icon' },
    { url: '/icon-17suit.png', type: 'image/png', sizes: '200x200' },
  ],
  shortcut: '/icon-17suit.ico',
  apple: '/icon-17suit.png',
};

export function baseMetadata(): Metadata {
  return { metadataBase: new URL(getSiteUrl()), icons: siteIcons };
}
