'use client';

import { useActionState, useState } from 'react';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton } from '@17suit/ui';
import { cancelReservationAction, type CancelFormState } from '@/app/c/[slug]/actions';
import { InlineError, InlineStatus } from '@/components/seven-rc-ui';

export interface ShareReservationProps {
  /** Absolute URL of this page, built on the server from the request host. */
  url: string;
  venueName: string;
  pitchName: string;
  /** Venue-local, human readable slot, e.g. "vie 9 oct, 8:00 p. m. – 9:00 p. m.". */
  when: string;
  /** Absolute URL of the `.ics` download. */
  calendarUrl: string;
}

export function ShareReservation({
  url,
  venueName,
  pitchName,
  when,
  calendarUrl,
}: ShareReservationProps) {
  const { t } = useTranslation('play');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const text = t('links.shareText', { venue: venueName });
  const details = t('links.shareDetails', { text, pitch: pitchName, when });
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${details} ${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setError(null);
      setMessage(t('links.copied'));
    } catch {
      setMessage(null);
      setError(t('links.copyFailed'));
    }
  }

  async function share() {
    if (typeof navigator.share !== 'function') return copy();
    try {
      await navigator.share({ title: text, text: details, url });
    } catch (cause) {
      // The user closing the share sheet is not an error.
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      await copy();
    }
  }

  return (
    <div className="grid gap-sm">
      <div className="flex flex-wrap gap-sm">
        <AppButton variant="neutral" fullWidth={false} onPress={share}>
          {t('links.share')}
        </AppButton>
        <AppButton variant="neutral" fullWidth={false} onPress={copy}>
          {t('links.copy')}
        </AppButton>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-md text-text underline"
        >
          {t('links.whatsapp')}
        </a>
        <a
          href={calendarUrl}
          download="reserva.ics"
          className="inline-flex items-center text-md text-text underline"
        >
          {t('links.calendar')}
        </a>
      </div>
      <InlineStatus message={message} />
      <InlineError message={error} />
    </div>
  );
}

const INITIAL: CancelFormState = { error: null };

export function CancelReservation({ slug, token }: { slug: string; token: string }) {
  const { t } = useTranslation('play');
  const [state, formAction, isPending] = useActionState(
    cancelReservationAction.bind(null, slug, token),
    INITIAL,
  );
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <AppButton variant="destructive" fullWidth={false} onPress={() => setConfirming(true)}>
        {t('links.cancel')}
      </AppButton>
    );
  }
  return (
    <form action={formAction} aria-label={t('links.confirmLabel')} className="grid gap-sm">
      <p className="m-0 text-md text-text">{t('links.sure')}</p>
      <InlineError message={state.error} />
      <div className="flex flex-wrap gap-sm">
        <AppButton type="submit" variant="destructive" fullWidth={false} disabled={isPending}>
          {isPending ? t('links.cancelling') : t('links.yes')}
        </AppButton>
        <AppButton
          variant="neutral"
          fullWidth={false}
          disabled={isPending}
          onPress={() => setConfirming(false)}
        >
          {t('links.back')}
        </AppButton>
      </div>
    </form>
  );
}
