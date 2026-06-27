'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { RefreshCcw } from '@17suit/ui';
import { notify } from '@17suit/ui/feedback/toast';
import { useRouter } from 'next/navigation';

export type GmailSyncMode = 'recent' | 'approved';

type GmailSyncContextValue = {
  isSyncing: boolean;
  activeMode: GmailSyncMode | null;
  runSync: (mode: GmailSyncMode, body: Record<string, unknown>) => void;
};

const GmailSyncContext = createContext<GmailSyncContextValue | null>(null);

export function useGmailSync(): GmailSyncContextValue {
  const context = useContext(GmailSyncContext);
  if (!context) {
    throw new Error('useGmailSync must be used within a GmailSyncProvider.');
  }
  return context;
}

type SyncJob = {
  status: 'pending' | 'processing' | 'processed' | 'failed' | 'ignored';
  fetchedMessages: number;
  parsedCandidates: number;
  pendingSenders: number;
  targetSenderCount: number;
  error: string | null;
};

const ENDPOINT_BY_MODE: Record<GmailSyncMode, string> = {
  recent: '/api/15ac/email-sources/gmail/sync-recent',
  approved: '/api/15ac/email-sources/gmail/sync-approved-channels',
};

const LOADING_LABEL: Record<GmailSyncMode, string> = {
  recent: 'Discovering recent emails…',
  approved: 'Syncing approved senders…',
};

const POLL_INTERVAL_MS = 1_500;
const POLL_TIMEOUT_MS = 180_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function pollSyncJob(jobId: string): Promise<SyncJob> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const response = await fetch(`/api/15ac/email-sources/gmail/sync-jobs/${jobId}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const job = (await response.json()) as SyncJob;
      if (job.status === 'processed' || job.status === 'failed') {
        return job;
      }
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error('Sync is taking longer than expected. It may still finish in the background.');
}

export function GmailSyncProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<GmailSyncMode | null>(null);
  const busyRef = useRef(false);

  const runSync = useCallback(
    (mode: GmailSyncMode, body: Record<string, unknown>) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setActiveMode(mode);
      const toastId = notify.loading(LOADING_LABEL[mode]);

      // The poll loop lives inside this event handler (no effect needed).
      void (async () => {
        try {
          const response = await fetch(ENDPOINT_BY_MODE[mode], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!response.ok) {
            const payload = (await response.json().catch(() => ({}))) as { message?: string };
            throw new Error(payload.message ?? 'Could not start the Gmail sync.');
          }
          const { jobId } = (await response.json()) as { jobId?: string };
          if (!jobId) {
            throw new Error('Gmail sync job was not created.');
          }

          const job = await pollSyncJob(jobId);
          if (job.status === 'failed') {
            throw new Error(job.error ?? 'Gmail sync failed.');
          }

          const summary =
            mode === 'recent'
              ? `${job.pendingSenders} pending senders ready for review.`
              : `${job.fetchedMessages} emails scanned, ${job.parsedCandidates} candidates added.`;
          notify.success(summary, { id: toastId });
          router.refresh();
        } catch (error) {
          notify.error(error instanceof Error ? error.message : 'Gmail sync failed.', {
            id: toastId,
          });
        } finally {
          busyRef.current = false;
          setActiveMode(null);
        }
      })();
    },
    [router],
  );

  return (
    <GmailSyncContext.Provider value={{ isSyncing: activeMode !== null, activeMode, runSync }}>
      {children}
    </GmailSyncContext.Provider>
  );
}

type SyncButtonProps = {
  mode: GmailSyncMode;
  body: Record<string, unknown>;
  className: string;
  children: ReactNode;
  disabled?: boolean;
};

export function SyncButton({ mode, body, className, children, disabled }: SyncButtonProps) {
  const { isSyncing, activeMode, runSync } = useGmailSync();
  const isActive = activeMode === mode;

  return (
    <button
      type="button"
      onClick={() => runSync(mode, body)}
      disabled={disabled || isSyncing}
      aria-busy={isActive}
      className={className}
    >
      <RefreshCcw
        size={16}
        strokeWidth={2.2}
        aria-hidden
        className={isActive ? 'animate-spin' : undefined}
      />
      {children}
    </button>
  );
}

export function RawEmailsSyncOverlay({ children }: { children: ReactNode }) {
  const { isSyncing } = useGmailSync();

  return (
    <div className="relative" aria-busy={isSyncing}>
      {isSyncing ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center rounded-[var(--radius-md)] bg-white/55 backdrop-blur-[1px]">
          <span className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.12)] bg-white px-3 py-2 text-sm font-bold text-brand-dark shadow-[0_8px_20px_rgba(0,23,31,0.12)]">
            <RefreshCcw size={16} strokeWidth={2.2} aria-hidden className="animate-spin" />
            Refreshing emails…
          </span>
        </div>
      ) : null}
      <div className={isSyncing ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        {children}
      </div>
    </div>
  );
}
