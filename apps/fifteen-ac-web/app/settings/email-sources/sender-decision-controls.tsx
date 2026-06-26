'use client';

import { Ban, CheckCircle2 } from '@17suit/ui';
import { notify } from '@17suit/ui/feedback/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGmailSync } from './gmail-sync-controls';

type SenderDecisionControlsProps = {
  rawEmailId: string;
  senderEmail: string;
  defaultName: string;
};

export function SenderDecisionControls({
  rawEmailId,
  senderEmail,
  defaultName,
}: SenderDecisionControlsProps) {
  const router = useRouter();
  const { isSyncing } = useGmailSync();
  const [name, setName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);
  const disabled = isSaving || isSyncing;

  async function decide(action: 'approve' | 'block') {
    if (disabled) return;
    setIsSaving(true);
    const toastId = notify.loading(
      action === 'approve' ? `Approving ${senderEmail}…` : `Blocking ${senderEmail}…`,
    );

    try {
      const endpoint =
        action === 'approve'
          ? '/api/15ac/email-sources/notification-channels'
          : '/api/15ac/email-sources/blocked-senders';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawEmailId,
          ...(action === 'approve' && name.trim() ? { name: name.trim() } : {}),
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message ?? `Could not ${action} sender.`);
      }

      notify.success(
        action === 'approve'
          ? 'Sender approved. Stored emails were sent to review.'
          : 'Sender blocked.',
        { id: toastId },
      );
      router.refresh();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Could not save sender decision.', {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Sender name</span>
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={disabled}
          className="w-full rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-2.5 py-1.5 text-xs text-brand-dark disabled:opacity-60"
        />
      </label>
      <button
        type="button"
        onClick={() => void decide('approve')}
        disabled={disabled}
        aria-label={`Approve sender ${senderEmail}`}
        title="Approve sender"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-dark text-white transition-transform duration-200 hover:-translate-y-px disabled:opacity-60"
      >
        <CheckCircle2 size={17} strokeWidth={2.4} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => void decide('block')}
        disabled={disabled}
        aria-label={`Block sender ${senderEmail}`}
        title="Block sender"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[#f8333c]/35 bg-[#f8333c]/10 text-[#b42318] transition-transform duration-200 hover:-translate-y-px disabled:opacity-60"
      >
        <Ban size={17} strokeWidth={2.4} aria-hidden />
      </button>
    </div>
  );
}
