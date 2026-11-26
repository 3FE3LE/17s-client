import { mobile as enMobile } from './en/mobile';
import { owner as enOwner } from './en/owner';
import { play as enPlay } from './en/play';
import { shell as enShell } from './en/shell';
import { venue as enVenue } from './en/venue';
import { mobile as esMobile } from './es/mobile';
import { owner as esOwner } from './es/owner';
import { play as esPlay } from './es/play';
import { shell as esShell } from './es/shell';
import { venue as esVenue } from './es/venue';

/** Seven Reservations Club catalogs, one namespace per area; `en` is the source of truth. */
export const sevenRcResources = {
  en: { owner: enOwner, venue: enVenue, play: enPlay, shell: enShell, mobile: enMobile },
  es: { owner: esOwner, venue: esVenue, play: esPlay, shell: esShell, mobile: esMobile },
} as const;

export const SEVEN_RC_NAMESPACES = ['owner', 'venue', 'play', 'shell', 'mobile'] as const;
export type SevenRcNamespace = (typeof SEVEN_RC_NAMESPACES)[number];
