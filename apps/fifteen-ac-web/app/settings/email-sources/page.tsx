import { redirect } from 'next/navigation';
import { CheckCircle2, Link2, PauseCircle, RefreshCcw, Search, Trash2 } from '@17suit/ui';

import { ErrorBlock, FifteenAcShell } from '@/components/fifteen-ac-shell';
import {
  deleteFifteenAcJson,
  fetchFifteenAcJson,
  patchFifteenAcJson,
  postFifteenAcJson,
} from '@/lib/fifteen-ac-server';
import { formatDate } from '@/lib/format';

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

type SyncResponse = {
  status: string;
  fetchedMessages: number;
  parsedCandidates: number;
  searchQuery: string;
  note: string;
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
  extractedFieldsJson: unknown;
};

type NotificationChannel = {
  id: string;
  name: string;
  senderEmail: string | null;
  senderDomain: string;
  templateType: string;
  createdAt: string;
};

const DEFAULT_GMAIL_FINANCE_QUERY =
  'newer_than:90d {davibank davivienda nu nubank rappicard rappi pse extracto compra pago factura transaccion transferencia tarjeta abono debito credito}';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const banner = getBanner(params);
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
        <div className="grid gap-[var(--spacing-lg)]">
          {banner ? (
            <div className="border-l-4 border-[#00916e] bg-white px-[var(--spacing-md)] py-3 text-sm font-bold text-brand-dark shadow-[0_10px_28px_rgba(0,23,31,0.08)]">
              {banner}
            </div>
          ) : null}

          <section className="grid gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[clamp(20px,3vw,36px)] shadow-[0_12px_30px_rgba(0,23,31,0.08)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-[42px] -top-[44px] h-[160px] w-[160px] rounded-full bg-[radial-gradient(circle,rgba(53,167,255,0.24),rgba(53,167,255,0))]" />
              <div className="pointer-events-none absolute bottom-[-42px] left-[8%] h-[110px] w-[min(56vw,520px)] skew-x-[-24deg] bg-[linear-gradient(90deg,rgba(0,145,110,0.18),rgba(0,145,110,0))]" />
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
                <div className="relative grid gap-2 text-sm">
                  {isGmailConnected ? (
                    <div className="rounded-[var(--radius-lg)] border border-[#00916e]/25 bg-[#00916e]/10 px-4 py-3">
                      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                        Account connected
                      </p>
                      <p className="m-0 mt-1 inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                        <CheckCircle2 size={16} strokeWidth={2.2} aria-hidden />
                        Gmail active
                      </p>
                    </div>
                  ) : (
                    <form action={connectGmailAction}>
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.24)] transition-transform duration-200 hover:-translate-y-px">
                        <Link2 size={16} strokeWidth={2.2} aria-hidden />
                        Connect Google
                      </button>
                    </form>
                  )}
                  <form action={syncApprovedChannelsAction}>
                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-4 py-[10px] font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px">
                      <RefreshCcw size={16} strokeWidth={2.2} aria-hidden />
                      Sync approved
                    </button>
                  </form>
                </div>
              </div>

              <form
                action={syncGmailAction}
                className="relative mt-[var(--spacing-lg)] grid gap-3 md:grid-cols-[110px_110px_1fr_auto] md:items-end"
              >
                <label className="grid gap-1 text-sm font-bold text-brand-dark">
                  Days
                  <input
                    name="days"
                    type="number"
                    min="1"
                    max="365"
                    defaultValue="90"
                    className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold text-brand-dark">
                  Limit
                  <input
                    name="maxResults"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="25"
                    className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold text-brand-dark">
                  Keywords
                  <input
                    name="keywords"
                    className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
                    defaultValue="pago factura compra recibo suscripcion transferencia tarjeta"
                  />
                </label>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px">
                  <Search size={16} strokeWidth={2.2} aria-hidden />
                  Discover
                </button>
              </form>
            </div>

            <div className="grid gap-[var(--spacing-sm)] sm:grid-cols-2 lg:grid-cols-1">
              <Metric
                label="Connection"
                value={gmailConnection?.status ?? 'Not connected'}
                detail={
                  gmailConnection?.lastSyncAt
                    ? `Last sync ${formatDate(gmailConnection.lastSyncAt)}`
                    : 'No sync yet'
                }
              />
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

          <section className="grid gap-[var(--spacing-sm)]">
            <article className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)] backdrop-blur-sm">
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
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px">
                        <PauseCircle size={16} strokeWidth={2.2} aria-hidden />
                        Disable
                      </button>
                    </form>
                  ) : (
                    <form action={connectGmailAction}>
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px">
                        <Link2 size={16} strokeWidth={2.2} aria-hidden />
                        Reconnect
                      </button>
                    </form>
                  )}
                  <form action={syncApprovedChannelsAction}>
                    <button
                      disabled={!isGmailConnected}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:border-[rgba(0,23,31,0.12)] disabled:bg-none disabled:bg-brand-light disabled:text-muted disabled:shadow-none"
                    >
                      <RefreshCcw size={16} strokeWidth={2.2} aria-hidden />
                      Re-sync
                    </button>
                  </form>
                  <form action={deleteGmailAction}>
                    <button
                      disabled={!gmailConnection}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#f8333c]/35 bg-[#f8333c]/10 px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} strokeWidth={2.2} aria-hidden />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <div className="mt-[var(--spacing-md)] border-t border-[rgba(0,23,31,0.1)] pt-[var(--spacing-md)]">
                <form
                  action={resetDetectedDataAction}
                  className="flex flex-wrap items-center gap-3"
                >
                  <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#f8333c]/35 bg-[#f8333c]/10 px-4 py-[10px] text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px">
                    <Trash2 size={16} strokeWidth={2.2} aria-hidden />
                    Reset detected data
                  </button>
                  <span className="text-sm text-muted">
                    Keeps approved channels and Gmail connection. Run Re-sync after reset.
                  </span>
                </form>
              </div>
            </article>
          </section>

          <section className="grid gap-[var(--spacing-sm)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                  Approved senders
                </p>
                <h2 className="m-0 font-amaranth text-2xl text-brand-dark">Trusted channels</h2>
              </div>
              <span className="bg-[#092025] px-3 py-2 text-sm font-bold text-white">
                {channels.length}
              </span>
            </div>
            <div className="grid gap-[var(--spacing-sm)] md:grid-cols-2 xl:grid-cols-3">
              {channels.length === 0 ? (
                <p className="m-0 border border-dashed border-[rgba(0,23,31,0.22)] bg-white p-[var(--spacing-md)] text-muted">
                  No notification channels yet.
                </p>
              ) : (
                channels.map((channel) => (
                  <article
                    key={channel.id}
                    className="border border-[rgba(0,23,31,0.12)] bg-white p-[var(--spacing-md)]"
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

          <section className="grid gap-[var(--spacing-sm)]">
            <div className="grid gap-3 border-b border-[rgba(0,23,31,0.14)] pb-[var(--spacing-sm)] lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                  Discovery inbox
                </p>
                <h2 className="m-0 font-amaranth text-2xl text-brand-dark">Recent synced emails</h2>
              </div>
              <form className="grid gap-2 md:grid-cols-[220px_220px_auto]">
                <select
                  name="event_type"
                  defaultValue={eventFilter ?? ''}
                  className="rounded-[var(--radius-sm)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm text-brand-dark"
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
                  className="rounded-[var(--radius-sm)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm text-brand-dark"
                >
                  <option value="">All impacts</option>
                  {impactTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button className="rounded-[var(--radius-sm)] border border-[rgba(0,23,31,0.18)] px-4 py-2 text-sm font-bold text-brand-dark">
                  Filter
                </button>
              </form>
            </div>
            <div className="grid gap-[var(--spacing-sm)]">
              {visibleRawEmails.length === 0 ? (
                <p className="m-0 border border-dashed border-[rgba(0,23,31,0.22)] bg-white p-[var(--spacing-md)] text-muted">
                  No synced emails yet.
                </p>
              ) : (
                visibleRawEmails.map((email) => (
                  <article
                    key={email.id}
                    className="grid gap-[var(--spacing-md)] border border-[rgba(0,23,31,0.12)] bg-white p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.05)] lg:grid-cols-[minmax(0,1fr)_300px]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-[var(--radius-sm)] px-2 py-1 text-xs font-bold ${impactTone(email.financialImpactType)}`}
                        >
                          {email.financialImpactType ?? 'UNKNOWN'}
                        </span>
                        <span className="text-xs font-light uppercase tracking-plus1_5 text-muted">
                          {formatDate(email.receivedAt)}
                        </span>
                      </div>
                      <h3 className="m-0 mt-2 font-amaranth text-xl text-brand-dark">
                        {email.subject}
                      </h3>
                      <p className="m-0 mt-1 break-all text-sm font-bold text-brand-dark">
                        {email.fromName ? `${email.fromName} · ` : ''}
                        {email.fromEmail}
                      </p>
                      <p className="m-0 mt-1 text-sm text-muted">
                        {email.eventType ?? 'UNCLASSIFIED'}
                        {email.classificationConfidence
                          ? ` · ${Math.round(Number(email.classificationConfidence) * 100)}%`
                          : ''}
                      </p>
                      <p className="m-0 mt-2 text-sm font-bold text-brand-dark">
                        {formatExtractedFields(email.extractedFieldsJson)}
                      </p>
                      {email.snippet ? (
                        <p className="m-0 mt-2 text-sm text-muted">{email.snippet}</p>
                      ) : null}
                    </div>
                    <form
                      action={createNotificationChannelAction}
                      className="grid content-start gap-2"
                    >
                      <input type="hidden" name="rawEmailId" value={email.id} />
                      <input
                        name="name"
                        defaultValue={email.fromName ?? email.fromEmail}
                        className="rounded-[var(--radius-sm)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm text-brand-dark"
                      />
                      <button className="rounded-[var(--radius-sm)] bg-brand-dark px-4 py-2 text-sm font-bold text-white">
                        Approve sender
                      </button>
                    </form>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
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

async function syncGmailAction(formData?: FormData) {
  'use server';

  const searchQuery = buildGmailSearchQuery(formData);
  const maxResults = getPositiveInteger(formData?.get('maxResults'), 25);
  let response: SyncResponse;
  try {
    response = await postFifteenAcJson<SyncResponse>('/email-sources/gmail/sync-recent', {
      searchQuery,
      maxResults,
    });
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }
  redirect(
    `/settings/email-sources?gmail_synced=${response.fetchedMessages}&gmail_candidates=${response.parsedCandidates}&gmail_query=${encodeURIComponent(response.searchQuery)}`,
  );
}

async function syncApprovedChannelsAction(formData?: FormData) {
  'use server';

  const maxResults = getPositiveInteger(formData?.get('maxResults'), 100);
  let response: SyncResponse;
  try {
    response = await postFifteenAcJson<SyncResponse>(
      '/email-sources/gmail/sync-approved-channels',
      {
        maxResults,
      },
    );
  } catch (error) {
    redirect(`/settings/email-sources?gmail_error=${encodeError(error)}`);
  }
  redirect(
    `/settings/email-sources?gmail_synced=${response.fetchedMessages}&gmail_candidates=${response.parsedCandidates}&gmail_query=${encodeURIComponent(response.searchQuery)}`,
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

function getBanner(params: Record<string, string | string[] | undefined>): string | null {
  const connected = firstParam(params.gmail);
  const error = firstParam(params.gmail_error);
  const synced = firstParam(params.gmail_synced);
  const candidates = firstParam(params.gmail_candidates);
  const query = firstParam(params.gmail_query);
  const disabled = firstParam(params.gmail_disabled);
  const deleted = firstParam(params.gmail_deleted);
  const detectedReset = firstParam(params.detected_reset);

  if (connected === 'connected') return 'Google connected. Run Sync recent to import raw messages.';
  if (disabled) return 'Gmail connection disabled. Reconnect when you want to resume ingestion.';
  if (deleted) return 'Gmail connection deleted. Stored evidence remains available.';
  if (detectedReset)
    return 'Detected email data reset. Approved channels were preserved; run Re-sync to rebuild candidates.';
  if (synced)
    return `Gmail sync completed. ${synced} recent messages were stored and ${candidates ?? '0'} approved-channel candidates were added to review.${query ? ` Filter: ${query}` : ''}`;
  if (error) return `Gmail action needs attention: ${error}`;
  return null;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border border-[rgba(0,23,31,0.12)] bg-white p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)]">
      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">{label}</p>
      <p className="m-0 mt-1 font-amaranth text-3xl leading-none text-brand-dark">{value}</p>
      <p className="m-0 mt-2 text-sm text-muted">{detail}</p>
    </article>
  );
}

function impactTone(value: string | null): string {
  if (value === 'CREATES_INCOME') return 'bg-[#e5f5ec] text-[#106438]';
  if (value === 'REDUCES_CARD_DEBT') return 'bg-[#e6f3fb] text-[#0f5a86]';
  if (value === 'CREATES_PAYABLE') return 'bg-[#fff6d8] text-[#76530b]';
  if (value === 'CREATES_EXPENSE') return 'bg-[#ffe8e6] text-[#97262e]';
  return 'bg-[#eef0f0] text-[#394448]';
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function encodeError(error: unknown): string {
  return encodeURIComponent(error instanceof Error ? error.message : 'Unknown Gmail sync error');
}

function formatExtractedFields(value: unknown): string {
  if (!value || typeof value !== 'object') return 'No extracted fields yet';
  const fields = value as Record<string, unknown>;
  return (
    [
      typeof fields.amount === 'number' && typeof fields.currencyCode === 'string'
        ? `${fields.currencyCode} ${fields.amount}`
        : null,
      typeof fields.merchantNameRaw === 'string' ? fields.merchantNameRaw : null,
      typeof fields.cardLast4 === 'string' ? `card *${fields.cardLast4}` : null,
    ]
      .filter(Boolean)
      .join(' · ') || 'No extracted fields yet'
  );
}

function buildGmailSearchQuery(formData?: FormData): string {
  if (!formData) return DEFAULT_GMAIL_FINANCE_QUERY;
  const days = getPositiveInteger(formData.get('days'), 90);
  const keywords = formData.get('keywords');
  const rawKeywords =
    typeof keywords === 'string' && keywords.trim().length > 0
      ? keywords.trim()
      : 'pago factura compra recibo suscripcion transferencia tarjeta';
  const keywordQuery = `{${rawKeywords
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .join(' ')}}`;
  return `newer_than:${days}d ${keywordQuery}`;
}

function getPositiveInteger(
  value: FormDataEntryValue | null | undefined,
  fallback: number,
): number {
  if (typeof value !== 'string') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
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
