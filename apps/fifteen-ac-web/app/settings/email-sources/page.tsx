import { redirect } from 'next/navigation';
import { CheckCircle2, Link2, PauseCircle, Separator, Trash2 } from '@17suit/ui';

import { ErrorBlock, FifteenAcShell } from '@/components/fifteen-ac-shell';
import {
  deleteFifteenAcJson,
  fetchFifteenAcJson,
  patchFifteenAcJson,
  postFifteenAcJson,
} from '@/lib/fifteen-ac-server';
import { formatDate } from '@/lib/format';
import {
  EmailSourceActionToast,
  type EmailSourceActionToastPayload,
} from './email-source-action-toast';
import { EmailSourceDiscoveryForm } from './email-source-discovery-form';
import { GmailSyncProvider, RawEmailsSyncOverlay, SyncButton } from './gmail-sync-controls';

type EmailConnection = {
  id: string;
  provider: 'OUTLOOK' | 'GMAIL' | 'MANUAL_IMPORT';
  status: string;
  scopes: string[];
  lastSyncAt: string | null;
  webhookExpiresAt: string | null;
  createdAt: string;
};

type ConnectResponse = {
  authorizationUrl?: string;
  status: 'configured' | 'missing_configuration' | 'placeholder';
  message: string;
};

type RawEmail = {
  id: string;
  provider: string;
  fromEmail: string;
  fromName: string | null;
  subject: string;
  receivedAt: string;
  snippet: string | null;
  eventType: string | null;
  financialImpactType: string | null;
  classificationConfidence: string | number | null;
};

type NotificationChannel = {
  id: string;
  name: string;
  senderEmail: string | null;
  senderDomain: string;
  templateType: string;
  createdAt: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const actionToast = getActionToast(params);
  const eventFilter = firstParam(params.event_type);
  const impactFilter = firstParam(params.impact_type);

  try {
    const [connections, rawEmails, channels] = await Promise.all([
      fetchFifteenAcJson<EmailConnection[]>('/email-sources'),
      fetchFifteenAcJson<RawEmail[]>('/email-sources/raw-emails'),
      fetchFifteenAcJson<NotificationChannel[]>('/email-sources/notification-channels'),
    ]);
    const visibleRawEmails = rawEmails.filter((email) => {
      if (eventFilter && email.eventType !== eventFilter) return false;
      if (impactFilter && email.financialImpactType !== impactFilter) return false;
      return true;
    });
    const gmailConnection = connections.find((connection) => connection.provider === 'GMAIL');
    const approvedDomains = new Set(channels.map((channel) => channel.senderDomain));
    const emailsFromApprovedChannels = rawEmails.filter((email) => {
      const domain = email.fromEmail.split('@')[1] ?? email.fromEmail;
      return approvedDomains.has(domain);
    }).length;
    const classifiedEmails = rawEmails.filter(
      (email) => email.eventType && email.eventType !== 'UNKNOWN',
    );
    const isGmailConnected = gmailConnection?.status === 'active';
    const averageConfidence =
      classifiedEmails.length > 0
        ? Math.round(
            (classifiedEmails.reduce(
              (sum, email) => sum + Number(email.classificationConfidence ?? 0),
              0,
            ) /
              classifiedEmails.length) *
              100,
          )
        : 0;

    return (
      <FifteenAcShell
        title="Email ingestion"
        eyebrow="Candidate discovery and approved sender sync"
      >
        <GmailSyncProvider>
          <div className="grid gap-[var(--spacing-lg)]">
            {actionToast ? <EmailSourceActionToast payload={actionToast} /> : null}

            <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 shadow-[0_12px_30px_rgba(0,23,31,0.08)] backdrop-blur-sm">
              <div className="relative p-[clamp(20px,3vw,36px)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#00916e,#35a7ff,#092025)]" />
                <div className="grid gap-[var(--spacing-md)] md:grid-cols-[1fr_auto] md:items-start">
                  <div className="relative">
                    <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                      Gmail pipeline
                    </p>
                    <h2 className="m-0 mt-2 max-w-[15ch] font-arvo text-[clamp(34px,5vw,56px)] font-bold leading-[1.06] tracking-minus1_5 text-text">
                      Discover, approve, then auto-detect.
                    </h2>
                    <p className="m-0 mt-3 max-w-[720px] text-md leading-[1.5] text-muted">
                      Recent emails stay as evidence first. Approved senders become trusted channels
                      for candidate parsing.
                    </p>
                  </div>
                  {isGmailConnected ? null : (
                    <div className="relative grid gap-2 text-sm">
                      <form action={connectGmailAction}>
                        <button className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)] transition-transform duration-200 hover:-translate-y-px">
                          <Link2 size={16} strokeWidth={2.2} aria-hidden />
                          Connect Google
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <EmailSourceDiscoveryForm />
              </div>

              <Separator />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                <Metric
                  label="Approved channels"
                  value={`${channels.length}`}
                  detail={`${emailsFromApprovedChannels} stored emails match`}
                />
                <Metric
                  label="Raw emails"
                  value={`${rawEmails.length}`}
                  detail={`${visibleRawEmails.length} visible with filters`}
                />
                <Metric
                  label="Classifier"
                  value={averageConfidence > 0 ? `${averageConfidence}%` : 'Pending'}
                  detail={`${classifiedEmails.length} classified emails`}
                />
              </div>
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)] backdrop-blur-sm">
              <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                    Email account
                  </p>
                  <h2 className="m-0 mt-1 font-amaranth text-2xl text-brand-dark">
                    {isGmailConnected ? 'Account connected' : 'Account not connected'}
                  </h2>
                  <p className="m-0 mt-1 text-md leading-[1.5] text-muted">
                    {gmailConnection
                      ? `Gmail is ${gmailConnection.status}. ${
                          gmailConnection.lastSyncAt
                            ? `Last sync ${formatDate(gmailConnection.lastSyncAt)}.`
                            : 'No sync yet.'
                        }`
                      : 'Connect Gmail to discover fifteenAc emails and approve senders.'}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
                  {isGmailConnected ? (
                    <form action={disableGmailAction}>
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.12)] bg-white px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px">
                        <PauseCircle size={16} strokeWidth={2.2} aria-hidden />
                        Disable
                      </button>
                    </form>
                  ) : (
                    <form action={connectGmailAction}>
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px">
                        <Link2 size={16} strokeWidth={2.2} aria-hidden />
                        Reconnect
                      </button>
                    </form>
                  )}
                  <SyncButton
                    mode="approved"
                    body={{ maxResults: 100 }}
                    disabled={!isGmailConnected || channels.length === 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:border-[rgba(0,23,31,0.12)] disabled:bg-none disabled:bg-brand-light disabled:text-muted disabled:shadow-none"
                  >
                    Re-sync
                  </SyncButton>
                  <form action={deleteGmailAction}>
                    <button
                      disabled={!gmailConnection}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#f8333c]/35 bg-[#f8333c]/10 px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} strokeWidth={2.2} aria-hidden />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <Separator className="my-[var(--spacing-md)]" />
              <form action={resetDetectedDataAction} className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#f8333c]/35 bg-[#f8333c]/10 px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px">
                  <Trash2 size={16} strokeWidth={2.2} aria-hidden />
                  Reset detected data
                </button>
                <span className="text-sm text-muted">
                  Keeps approved channels and Gmail connection. Run Re-sync after reset.
                </span>
              </form>
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)] backdrop-blur-sm">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                    Approved senders
                  </p>
                  <h2 className="m-0 font-amaranth text-2xl text-brand-dark">Trusted channels</h2>
                </div>
                <div className="flex items-center gap-2">
                  <SyncButton
                    mode="approved"
                    body={{ maxResults: 100 }}
                    disabled={!isGmailConnected || channels.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:border-[rgba(0,23,31,0.12)] disabled:bg-none disabled:bg-brand-light disabled:text-muted disabled:shadow-none"
                  >
                    Sync approved
                  </SyncButton>
                  <span className="rounded-[var(--radius-md)] bg-[#092025] px-3 py-2 text-sm font-bold text-white">
                    {channels.length}
                  </span>
                </div>
              </div>
              <Separator className="my-[var(--spacing-md)]" />
              <div className="grid gap-[var(--spacing-sm)] md:grid-cols-2 xl:grid-cols-3">
                {channels.length === 0 ? (
                  <p className="m-0 rounded-[var(--radius-md)] border border-dashed border-[rgba(0,23,31,0.22)] bg-white/60 p-[var(--spacing-md)] text-muted">
                    No notification channels yet.
                  </p>
                ) : (
                  channels.map((channel) => (
                    <article
                      key={channel.id}
                      className="rounded-[var(--radius-md)] bg-white/60 p-[var(--spacing-md)]"
                    >
                      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                        Approved sender
                      </p>
                      <p className="m-0 mt-1 font-bold text-brand-dark">{channel.name}</p>
                      <p className="m-0 mt-1 break-all text-sm text-muted">
                        {channel.senderEmail ?? channel.senderDomain}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)] backdrop-blur-sm">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                    Discovery inbox
                  </p>
                  <h2 className="m-0 font-amaranth text-2xl text-brand-dark">
                    Recent synced emails
                  </h2>
                </div>
                {rawEmails.length > 0 ? (
                  <form className="grid gap-2 md:grid-cols-[220px_220px_auto]">
                    <select
                      name="event_type"
                      defaultValue={eventFilter ?? ''}
                      className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm text-brand-dark"
                    >
                      <option value="">All event types</option>
                      {eventTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <select
                      name="impact_type"
                      defaultValue={impactFilter ?? ''}
                      className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm text-brand-dark"
                    >
                      <option value="">All impacts</option>
                      {impactTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] px-4 py-2 text-sm font-bold text-brand-dark">
                      Filter
                    </button>
                  </form>
                ) : null}
              </div>
              <Separator className="my-[var(--spacing-md)]" />
              <RawEmailsSyncOverlay>
                {rawEmails.length === 0 ? (
                  <p className="m-0 rounded-[var(--radius-md)] border border-dashed border-[rgba(0,23,31,0.22)] bg-white/60 p-[var(--spacing-md)] text-muted">
                    No emails fetched yet. Connect Gmail and run a sync to populate this inbox.
                  </p>
                ) : (
                  <div className="max-h-[560px] overflow-y-auto pr-1">
                    {visibleRawEmails.length === 0 ? (
                      <p className="m-0 rounded-[var(--radius-md)] border border-dashed border-[rgba(0,23,31,0.22)] bg-white/60 p-[var(--spacing-md)] text-muted">
                        No emails match the current filters.
                      </p>
                    ) : (
                      visibleRawEmails.map((email, index) => (
                        <div key={email.id}>
                          {index > 0 ? <Separator /> : null}
                          <article className="grid gap-3 py-2.5 lg:grid-cols-[minmax(170px,0.72fr)_minmax(220px,1.45fr)_120px_220px] lg:items-center">
                            <div className="min-w-0">
                              <p className="m-0 truncate text-sm font-bold text-brand-dark">
                                {email.fromName || email.fromEmail}
                              </p>
                              <p className="m-0 truncate text-xs text-muted">{email.fromEmail}</p>
                            </div>
                            <div className="min-w-0">
                              <h3 className="m-0 truncate text-sm font-bold text-brand-dark">
                                {email.subject}
                              </h3>
                              {email.snippet ? (
                                <p className="m-0 mt-0.5 truncate text-xs text-muted">
                                  {email.snippet}
                                </p>
                              ) : null}
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                                {email.financialImpactType &&
                                email.financialImpactType !== 'UNKNOWN' ? (
                                  <span className="font-bold text-brand-secondary">
                                    {email.financialImpactType}
                                  </span>
                                ) : null}
                                {email.eventType && email.eventType !== 'UNKNOWN' ? (
                                  <span>{email.eventType}</span>
                                ) : null}
                                {email.classificationConfidence ? (
                                  <span>
                                    {Math.round(Number(email.classificationConfidence) * 100)}%
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <time
                              dateTime={email.receivedAt}
                              className="text-xs font-light uppercase tracking-plus1_5 text-muted lg:text-right"
                            >
                              {formatDate(email.receivedAt)}
                            </time>
                            <form
                              action={createNotificationChannelAction}
                              className="grid grid-cols-[minmax(0,1fr)_36px] items-center gap-2"
                            >
                              <input type="hidden" name="rawEmailId" value={email.id} />
                              <input
                                name="name"
                                defaultValue={email.fromName ?? email.fromEmail}
                                className="min-w-0 rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-2.5 py-1.5 text-xs text-brand-dark"
                              />
                              <button
                                type="submit"
                                aria-label={`Approve sender ${email.fromEmail}`}
                                title="Approve sender"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-brand-dark text-white transition-transform duration-200 hover:-translate-y-px"
                              >
                                <CheckCircle2 size={17} strokeWidth={2.4} aria-hidden />
                              </button>
                            </form>
                          </article>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </RawEmailsSyncOverlay>
            </section>
          </div>
        </GmailSyncProvider>
      </FifteenAcShell>
    );
  } catch (error) {
    return (
      <FifteenAcShell title="Email sources" eyebrow="Google Gmail ingestion">
        <ErrorBlock message={error instanceof Error ? error.message : 'Unable to load records'} />
      </FifteenAcShell>
    );
  }
}

async function connectGmailAction() {
  'use server';

  let response: ConnectResponse;
  try {
    response = await postFifteenAcJson<ConnectResponse>('/email-sources/gmail/connect');
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }

  if (response.authorizationUrl) {
    redirect(response.authorizationUrl);
  }

  redirect(
    `/settings/email-sources?gmail_error=${encodeURIComponent(response.message || response.status)}`,
  );
}

async function disableGmailAction() {
  'use server';

  try {
    await patchFifteenAcJson('/email-sources/gmail/disable');
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }
  redirect('/settings/email-sources?gmail_disabled=1');
}

async function deleteGmailAction() {
  'use server';

  try {
    await deleteFifteenAcJson('/email-sources/gmail/connection');
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }
  redirect('/settings/email-sources?gmail_deleted=1');
}

async function resetDetectedDataAction() {
  'use server';

  try {
    await postFifteenAcJson('/email-sources/reset-detected-data');
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }
  redirect('/settings/email-sources?detected_reset=1');
}

async function createNotificationChannelAction(formData: FormData) {
  'use server';

  const rawEmailId = formData.get('rawEmailId');
  const name = formData.get('name');
  if (typeof rawEmailId === 'string') {
    await postFifteenAcJson('/email-sources/notification-channels', {
      rawEmailId,
      ...(typeof name === 'string' && name.trim().length > 0 ? { name: name.trim() } : {}),
    });
  }
  redirect('/settings/email-sources');
}

function getActionToast(
  params: Record<string, string | string[] | undefined>,
): EmailSourceActionToastPayload | null {
  const connected = firstParam(params.gmail);
  const error = firstParam(params.gmail_error);
  const disabled = firstParam(params.gmail_disabled);
  const deleted = firstParam(params.gmail_deleted);
  const detectedReset = firstParam(params.detected_reset);
  const clearHref = getEmailSourceCleanHref(params);

  if (connected === 'connected') {
    return {
      type: 'success',
      message: 'Google connected. Importing your recent emails in the background…',
      clearHref,
    };
  }
  if (disabled) {
    return {
      type: 'info',
      message: 'Gmail connection disabled. Reconnect when you want to resume ingestion.',
      clearHref,
    };
  }
  if (deleted) {
    return {
      type: 'info',
      message: 'Gmail connection deleted. Stored evidence remains available.',
      clearHref,
    };
  }
  if (detectedReset) {
    return {
      type: 'success',
      message:
        'Detected email data reset. Approved channels were preserved; run Re-sync to rebuild candidates.',
      clearHref,
    };
  }
  if (error) {
    return {
      type: 'error',
      message: `Gmail action needs attention: ${error}`,
      clearHref,
    };
  }
  return null;
}

function getEmailSourceCleanHref(params: Record<string, string | string[] | undefined>): string {
  const feedbackParams = new Set([
    'gmail',
    'gmail_error',
    'gmail_disabled',
    'gmail_deleted',
    'detected_reset',
  ]);
  const cleanParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (feedbackParams.has(key) || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => cleanParams.append(key, item));
      return;
    }
    cleanParams.set(key, value);
  });
  const queryString = cleanParams.toString();
  return `/settings/email-sources${queryString ? `?${queryString}` : ''}`;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border-b border-[rgba(0,23,31,0.08)] p-[var(--spacing-md)] sm:border-r sm:last:border-r-0 lg:border-b-0">
      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">{label}</p>
      <p className="m-0 mt-1 font-amaranth text-3xl leading-none text-brand-dark">{value}</p>
      <p className="m-0 mt-2 text-sm text-muted">{detail}</p>
    </article>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function encodeError(error: unknown): string {
  return encodeURIComponent(error instanceof Error ? error.message : 'Unknown Gmail sync error');
}

const eventTypeOptions = [
  'PURCHASE_AUTHORIZATION',
  'PAYMENT_CONFIRMATION',
  'CARD_PAYMENT_CONFIRMATION',
  'BILL_ISSUED',
  'BILL_DUE_REMINDER',
  'STATEMENT_AVAILABLE',
  'SUBSCRIPTION_CHARGE',
  'SUBSCRIPTION_INVOICE',
  'REFUND_CONFIRMATION',
  'TRANSFER_SENT',
  'TRANSFER_RECEIVED',
  'INCOME_RECEIVED',
  'SECURITY_NOTIFICATION',
  'MARKETING',
  'UNKNOWN',
];

const impactTypeOptions = [
  'CREATES_EXPENSE',
  'CREATES_INCOME',
  'REDUCES_CARD_DEBT',
  'CREATES_PAYABLE',
  'INFORMATION_ONLY',
  'UNKNOWN',
];
