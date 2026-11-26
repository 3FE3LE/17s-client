/**
 * Publication state of the owner-written legal texts (/privacy, /terms).
 *
 * While this is false the legal pages are outlines only, so product pages must
 * not send people to them as if they held a real policy (e.g. Fifteen's
 * "Tus datos" block before the Gmail step). The footer links stay: those pages
 * say openly that the document is in review.
 *
 * TODO(legal): set to true once the owner publishes the final privacy policy text.
 */
export const LEGAL_PUBLISHED = false;
