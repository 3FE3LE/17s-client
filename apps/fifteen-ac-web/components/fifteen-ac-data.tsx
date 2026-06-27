import type {
  FifteenAcDashboardOverview,
  FifteenAcTransaction,
} from '@17suit/module-fifteen-all-check';
import { cardRecipe, cx, inputRecipe, Separator } from '@17suit/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DataCard, ErrorBlock, FifteenAcShell } from './fifteen-ac-shell';
import { fetchFifteenAcJson, patchFifteenAcJson, postFifteenAcJson } from '@/lib/fifteen-ac-server';
import { formatDate, formatMoney } from '@/lib/format';

type FifteenAcTransactionCandidate = {
  id: string;
  candidateType: string;
  amount: string | number;
  currencyCode: string;
  occurredAt: string;
  merchantNameRaw?: string | null;
  cardLast4?: string | null;
  referenceCode?: string | null;
  accountId?: string | null;
  creditCardId?: string | null;
  confidenceScore: string | number;
  status: string;
  rawEmail?: {
    fromEmail: string;
    subject: string;
    snippet?: string | null;
    eventType?: string | null;
    financialImpactType?: string | null;
    extractedFieldsJson?: unknown;
  } | null;
};

type FifteenAcAccount = {
  id: string;
  name: string;
  type: string;
  institutionName?: string | null;
  currencyCode: string;
};

type FifteenAcCreditCard = {
  id: string;
  name: string;
  issuer: string;
  last4: string;
  creditLimit: string | number;
  currencyCode: string;
  cutDay: number;
  paymentDueDay: number;
  interestRateMonthly?: string | number | null;
};

type FifteenAcCategory = {
  id: string;
  name: string;
  color?: string | null;
};

type FifteenAcIncomeSource = {
  id: string;
  name: string;
  type: string;
  expectedAmount: string | number;
  currencyCode: string;
  frequency: string;
  expectedPaymentDay?: number | null;
};

type FifteenAcRecurring = {
  id: string;
  name: string;
  amount: string | number;
  currencyCode: string;
  frequency: string;
  dueDay?: number | null;
  nextBillingDate?: string | null;
  paymentMethodType: string;
  account?: { name: string } | null;
  creditCard?: { name: string; last4: string } | null;
  category?: { name: string } | null;
  billingStatus?: {
    status: 'paid' | 'pending';
    expectedAmount: number;
    paidAmount: number | null;
    variance: number | null;
    varianceType: 'overcost' | 'reduction' | 'matched' | null;
    paidAt: string | null;
    cycleStart: string;
    cycleEnd: string;
  };
};

const panelClassName = cardRecipe({ variant: 'panel' });
const insetClassName = cardRecipe({ variant: 'inset' });
const fieldClasses = inputRecipe();
const darkSubmitButtonClassName =
  'rounded-[var(--radius-sm)] bg-brand-dark px-4 py-2 text-sm font-bold text-white';
const outlineButtonClassName =
  'rounded-[var(--radius-sm)] border border-border-strong px-4 py-2 text-sm font-bold text-brand-dark';

const sectionPanelClassName =
  'rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 p-[var(--spacing-md)] shadow-[0_10px_28px_rgba(0,23,31,0.06)] backdrop-blur-sm';
const reviewCardClassName =
  'grid gap-[var(--spacing-md)] rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.08)] bg-white/60 p-[var(--spacing-md)] lg:grid-cols-[minmax(0,1fr)_340px]';
const sectionEyebrowClassName =
  'm-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary';
const countBadgeClassName =
  'rounded-[var(--radius-md)] bg-[#092025] px-3 py-2 text-sm font-bold text-white';

export async function DashboardScreen() {
  try {
    const data = await fetchFifteenAcJson<FifteenAcDashboardOverview>('/dashboard/overview');

    return (
      <FifteenAcShell title="Fifteen All Check" eyebrow="Financial cockpit">
        <div className="grid gap-[var(--spacing-lg)]">
          <section className="grid grid-cols-1 gap-[var(--spacing-sm)] md:grid-cols-4">
            <DataCard
              label="Income received"
              value={formatMoney(data.incomeReceived, data.currencyCode)}
              tone="good"
            />
            <DataCard
              label="Expenses"
              value={formatMoney(data.expenses, data.currencyCode)}
              tone="hot"
            />
            <DataCard
              label="Balance impact"
              value={formatMoney(data.estimatedBalanceImpact, data.currencyCode)}
            />
            <DataCard label="Pending review" value={`${data.pendingReviewItems}`} tone="warn" />
          </section>

          <section className="grid gap-[var(--spacing-md)] lg:grid-cols-2">
            <Breakdown
              title="Top categories"
              items={data.topCategories}
              currencyCode={data.currencyCode}
            />
            <Breakdown
              title="Top merchants"
              items={data.topMerchants}
              currencyCode={data.currencyCode}
            />
          </section>

          <section className={panelClassName}>
            <h2 className="m-0 font-amaranth text-xl text-brand-dark">Credit cards</h2>
            <div className="mt-[var(--spacing-sm)] grid gap-[var(--spacing-sm)] md:grid-cols-2">
              {data.creditCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-[var(--radius-sm)] border border-border-default p-[var(--spacing-md)]"
                >
                  <p className="m-0 font-bold">
                    {card.name} *{card.last4}
                  </p>
                  <p className="m-0 mt-1 text-muted">
                    Cut day {card.cutDay} · Due day {card.paymentDueDay} · Limit{' '}
                    {formatMoney(card.creditLimit, data.currencyCode)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return (
      <FifteenAcShell title="Fifteen All Check" eyebrow="Financial cockpit">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'Unable to load fifteenAc data'}
        />
      </FifteenAcShell>
    );
  }
}

export async function TransactionsScreen() {
  try {
    const items = await fetchFifteenAcJson<FifteenAcTransaction[]>('/transactions');

    return (
      <FifteenAcShell title="Transactions" eyebrow="Confirmed ledger">
        <div className={cardRecipe({ variant: 'list' })}>
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 border-b border-border-hairline p-[var(--spacing-md)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <p className="m-0 font-bold text-brand-dark">
                  {item.description ?? item.merchant?.name ?? item.type}
                </p>
                <p className="m-0 text-muted">
                  {formatDate(item.occurredAt)} · {item.category?.name ?? 'Uncategorized'} ·{' '}
                  {item.origin} · evidence {item.evidence?.length ?? 0}
                </p>
              </div>
              <strong>{formatMoney(item.amount, item.currencyCode)}</strong>
            </div>
          ))}
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return (
      <FifteenAcShell title="Transactions" eyebrow="Confirmed ledger">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'Unable to load transactions'}
        />
      </FifteenAcShell>
    );
  }
}

const CANDIDATE_TYPE_LABELS: Record<string, string> = {
  PURCHASE: 'Gasto',
  FIXED_OBLIGATION: 'Pago de factura',
  SUBSCRIPTION: 'Suscripción',
  CARD_PAYMENT: 'Pago de tarjeta',
  INCOME: 'Ingreso',
  TRANSFER: 'Transferencia',
  REFUND: 'Reembolso',
  FEE: 'Comisión',
  UNKNOWN: 'Sin clasificar',
};

function humanType(type: string): string {
  return CANDIDATE_TYPE_LABELS[type] ?? 'Movimiento';
}

// Interpreted financial impact shown before confirming, so the user sees what
// the movement will do to their estimate without reading internal enums.
function estimateImpact(
  type: string,
  amount: string | number,
  currencyCode: string,
): { label: string; tone: string } {
  const money = formatMoney(amount, currencyCode);
  switch (type) {
    case 'INCOME':
    case 'REFUND':
      return { label: `Ingreso +${money}`, tone: 'text-[#00916e]' };
    case 'CARD_PAYMENT':
      return { label: `Pago de tarjeta −${money} · reduce deuda`, tone: 'text-muted' };
    case 'TRANSFER':
      return { label: `Transferencia ${money}`, tone: 'text-muted' };
    default:
      return { label: `Gasto −${money}`, tone: 'text-[#b3261e]' };
  }
}

export async function ReviewScreen() {
  try {
    const [candidates, categories, accounts, cards] = await Promise.all([
      fetchFifteenAcJson<FifteenAcTransactionCandidate[]>('/transaction-candidates'),
      fetchFifteenAcJson<FifteenAcCategory[]>('/categories'),
      fetchFifteenAcJson<FifteenAcAccount[]>('/accounts'),
      fetchFifteenAcJson<FifteenAcCreditCard[]>('/credit-cards'),
    ]);
    const pending = candidates.filter((candidate) => candidate.status === 'PENDING_REVIEW');
    const ready = pending.filter((candidate) => Number(candidate.confidenceScore) >= 0.85);
    const needsCorrection = pending.filter((candidate) => Number(candidate.confidenceScore) < 0.85);
    const rejected = candidates.filter((candidate) => candidate.status === 'REJECTED').slice(0, 8);
    const queue = [...needsCorrection, ...ready];

    // One card = evidence on the left, the interpreted movement plus a single
    // atomic confirm form on the right. `expanded` opens the detail fields and
    // shows the low-confidence hint for the "needs correction" bucket.
    const renderItem = (candidate: FifteenAcTransactionCandidate, expanded: boolean) => {
      const impact = estimateImpact(
        candidate.candidateType,
        candidate.amount,
        candidate.currencyCode,
      );
      const matchedCard = cards.find((card) => card.last4 === candidate.cardLast4);
      const defaultSource = candidate.creditCardId
        ? `card:${candidate.creditCardId}`
        : candidate.accountId
          ? `acc:${candidate.accountId}`
          : matchedCard
            ? `card:${matchedCard.id}`
            : '';
      return (
        <article key={candidate.id} className={reviewCardClassName}>
          <div>
            <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
              Evidencia
            </p>
            {candidate.rawEmail ? (
              <div className={cx(insetClassName, 'mt-[var(--spacing-sm)] grid gap-1')}>
                <p className="m-0 text-sm font-bold text-brand-dark">
                  {candidate.rawEmail.subject}
                </p>
                <p className="m-0 break-all text-xs text-muted">{candidate.rawEmail.fromEmail}</p>
                {candidate.rawEmail.snippet ? (
                  <p className="m-0 text-sm text-muted">{candidate.rawEmail.snippet}</p>
                ) : null}
              </div>
            ) : (
              <p className="m-0 mt-[var(--spacing-sm)] text-sm text-muted">Sin correo asociado.</p>
            )}
          </div>
          <form action={confirmCandidateAction} className="grid gap-2">
            <input type="hidden" name="candidateId" value={candidate.id} />
            <div>
              <p className="m-0 font-amaranth text-lg text-brand-dark">
                {candidate.merchantNameRaw ?? candidate.rawEmail?.fromEmail ?? 'Movimiento'}
              </p>
              <p className={cx('m-0 mt-1 text-sm font-bold', impact.tone)}>
                Impacto estimado: {impact.label}
              </p>
              {expanded ? (
                <p className="m-0 mt-1 text-xs text-muted">
                  Confianza baja — revisa los datos antes de confirmar.
                </p>
              ) : null}
            </div>
            <label className="grid gap-1 text-sm font-bold text-brand-dark">
              Tipo de movimiento
              <select
                name="candidateType"
                defaultValue={candidate.candidateType}
                className={fieldClasses.control}
              >
                {candidateTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {humanType(option.value)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1 text-sm font-bold text-brand-dark">
                Monto
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={String(candidate.amount)}
                  className={fieldClasses.control}
                />
              </label>
              <label className="grid gap-1 text-sm font-bold text-brand-dark">
                Fecha
                <input
                  name="occurredAt"
                  type="date"
                  defaultValue={candidate.occurredAt.slice(0, 10)}
                  className={fieldClasses.control}
                />
              </label>
            </div>
            <label className="grid gap-1 text-sm font-bold text-brand-dark">
              ¿De dónde salió?
              <select name="source" defaultValue={defaultSource} className={fieldClasses.control}>
                <option value="">Sin definir</option>
                {accounts.length > 0 ? (
                  <optgroup label="Cuentas">
                    {accounts.map((account) => (
                      <option key={account.id} value={`acc:${account.id}`}>
                        {account.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                {cards.length > 0 ? (
                  <optgroup label="Tarjetas">
                    {cards.map((card) => (
                      <option key={card.id} value={`card:${card.id}`}>
                        {card.name} *{card.last4}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-brand-dark">
              Categoría
              <select name="categoryId" defaultValue="" className={fieldClasses.control}>
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <details {...(expanded ? { open: true } : {})}>
              <summary className="cursor-pointer text-sm font-bold text-brand-secondary">
                Ajustar detalles
              </summary>
              <div className="mt-2 grid gap-2">
                <label className="grid gap-1 text-sm font-bold text-brand-dark">
                  Nombre / comercio
                  <input
                    name="merchantNameRaw"
                    defaultValue={candidate.merchantNameRaw ?? ''}
                    className={fieldClasses.control}
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1 text-sm font-bold text-brand-dark">
                    Moneda
                    <input
                      name="currencyCode"
                      maxLength={3}
                      defaultValue={candidate.currencyCode}
                      className={cx(fieldClasses.control, 'uppercase')}
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-bold text-brand-dark">
                    Tarjeta (4 díg.)
                    <input
                      name="cardLast4"
                      maxLength={4}
                      defaultValue={candidate.cardLast4 ?? ''}
                      className={fieldClasses.control}
                    />
                  </label>
                </div>
                <label className="grid gap-1 text-sm font-bold text-brand-dark">
                  Referencia
                  <input
                    name="referenceCode"
                    defaultValue={candidate.referenceCode ?? ''}
                    className={fieldClasses.control}
                  />
                </label>
              </div>
            </details>
            <button className={cx(darkSubmitButtonClassName, 'w-full')}>
              Confirmar movimiento
            </button>
            <details>
              <summary className="cursor-pointer text-center text-xs text-muted">
                No es un movimiento
              </summary>
              <button
                formAction={rejectCandidateAction}
                className={cx(outlineButtonClassName, 'mt-2 w-full')}
              >
                Descartar evidencia
              </button>
            </details>
          </form>
        </article>
      );
    };

    return (
      <FifteenAcShell title="Confirmar movimientos" eyebrow="Revisión de evidencias">
        <div className="grid gap-[var(--spacing-lg)]">
          <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/85 shadow-[0_12px_30px_rgba(0,23,31,0.08)] backdrop-blur-sm">
            <div className="relative p-[clamp(20px,3vw,36px)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#00916e,#35a7ff,#092025)]" />
              <p className={sectionEyebrowClassName}>Cola de revisión</p>
              <h2 className="m-0 mt-2 max-w-[18ch] font-arvo text-[clamp(34px,5vw,56px)] font-bold leading-[1.06] tracking-minus1_5 text-text">
                Confirma cada movimiento.
              </h2>
              <p className="m-0 mt-3 max-w-[720px] text-md leading-[1.5] text-muted">
                Cada evidencia se traduce en un movimiento de dinero. Revisa el impacto estimado,
                corrige lo que haga falta y confírmalo para sumarlo a tu estimación.
              </p>
              <p className="m-0 mt-4 text-sm text-muted">
                {queue.length} pendiente{queue.length === 1 ? '' : 's'} · {ready.length} listo
                {ready.length === 1 ? '' : 's'} · {needsCorrection.length} por corregir
              </p>
            </div>
          </section>

          {queue.length === 0 ? (
            <section className={cx(sectionPanelClassName, 'text-center')}>
              <h2 className="m-0 font-amaranth text-2xl text-brand-dark">Cola al día</h2>
              <p className="m-0 mt-2 text-muted">No hay evidencias pendientes por confirmar.</p>
              <div className="mt-[var(--spacing-md)] flex flex-wrap justify-center gap-2">
                <Link href="/" className={darkSubmitButtonClassName}>
                  Ver el panel
                </Link>
                <Link href="/settings/email-sources" className={outlineButtonClassName}>
                  Importar más correos
                </Link>
              </div>
            </section>
          ) : (
            <>
              {needsCorrection.length > 0 ? (
                <section className={sectionPanelClassName}>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className={sectionEyebrowClassName}>Necesitan corrección</p>
                      <h2 className="m-0 font-amaranth text-2xl text-brand-dark">
                        Revisa antes de confirmar
                      </h2>
                    </div>
                    <span className={countBadgeClassName}>{needsCorrection.length}</span>
                  </div>
                  <Separator className="my-[var(--spacing-md)]" />
                  <div className="grid gap-[var(--spacing-sm)]">
                    {needsCorrection.map((candidate) => renderItem(candidate, true))}
                  </div>
                </section>
              ) : null}

              {ready.length > 0 ? (
                <section className={sectionPanelClassName}>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className={sectionEyebrowClassName}>Listos para confirmar</p>
                      <h2 className="m-0 font-amaranth text-2xl text-brand-dark">Alta confianza</h2>
                    </div>
                    <span className={countBadgeClassName}>{ready.length}</span>
                  </div>
                  <Separator className="my-[var(--spacing-md)]" />
                  <div className="grid gap-[var(--spacing-sm)]">
                    {ready.map((candidate) => renderItem(candidate, false))}
                  </div>
                </section>
              ) : null}
            </>
          )}

          {rejected.length > 0 ? (
            <section className={sectionPanelClassName}>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className={sectionEyebrowClassName}>Descartados recientemente</p>
                  <h2 className="m-0 font-amaranth text-2xl text-brand-dark">¿Te equivocaste?</h2>
                </div>
                <span className={countBadgeClassName}>{rejected.length}</span>
              </div>
              <Separator className="my-[var(--spacing-md)]" />
              <div className="grid gap-[var(--spacing-sm)]">
                {rejected.map((candidate) => (
                  <article
                    key={candidate.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.08)] bg-white/60 p-[var(--spacing-sm)]"
                  >
                    <div>
                      <p className="m-0 text-sm font-bold text-brand-dark">
                        {candidate.merchantNameRaw ?? candidate.rawEmail?.fromEmail ?? 'Movimiento'}
                      </p>
                      <p className="m-0 text-xs text-muted">
                        {formatDate(candidate.occurredAt)} ·{' '}
                        {formatMoney(candidate.amount, candidate.currencyCode)}
                      </p>
                    </div>
                    <form action={restoreCandidateAction}>
                      <input type="hidden" name="candidateId" value={candidate.id} />
                      <button className={outlineButtonClassName}>Deshacer</button>
                    </form>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return (
      <FifteenAcShell title="Confirmar movimientos" eyebrow="Revisión de evidencias">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'No se pudo cargar la cola de revisión'}
        />
      </FifteenAcShell>
    );
  }
}

async function confirmCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    // The source select packs account vs card into one control as "acc:<id>"
    // or "card:<id>"; split it back into the two fields the API expects.
    const source = getString(formData.get('source'));
    const accountId = source?.startsWith('acc:') ? source.slice(4) : undefined;
    const creditCardId = source?.startsWith('card:') ? source.slice(5) : undefined;

    await postFifteenAcJson(`/transaction-candidates/${candidateId}/confirm`, {
      candidateType: getString(formData.get('candidateType')),
      amount: getNumber(formData.get('amount')),
      currencyCode: getString(formData.get('currencyCode'))?.toUpperCase(),
      occurredAt: getString(formData.get('occurredAt')),
      merchantNameRaw: getString(formData.get('merchantNameRaw')) ?? '',
      cardLast4: getString(formData.get('cardLast4')) ?? '',
      referenceCode: getString(formData.get('referenceCode')) ?? '',
      categoryId: getString(formData.get('categoryId')),
      accountId,
      creditCardId,
    });
  }
  redirect('/review');
}

async function rejectCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    await postFifteenAcJson(`/transaction-candidates/${candidateId}/reject`);
  }
  redirect('/review');
}

async function restoreCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    await postFifteenAcJson(`/transaction-candidates/${candidateId}/restore`);
  }
  redirect('/review');
}

function getString(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function getNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const candidateTypeOptions = [
  { value: 'PURCHASE', label: 'Purchase' },
  { value: 'FIXED_OBLIGATION', label: 'Bill / fixed obligation' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'CARD_PAYMENT', label: 'Card payment' },
  { value: 'INCOME', label: 'Income' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'REFUND', label: 'Refund' },
  { value: 'FEE', label: 'Fee' },
];

export async function SimpleCollectionScreen({
  title,
  eyebrow,
  endpoint,
}: {
  title: string;
  eyebrow: string;
  endpoint: string;
}) {
  try {
    const items = await fetchFifteenAcJson<unknown[]>(endpoint);

    return (
      <FifteenAcShell title={title} eyebrow={eyebrow}>
        <div className="grid gap-[var(--spacing-sm)] md:grid-cols-2">
          {items.map((item, index) => (
            <article key={extractId(item, index)} className={panelClassName}>
              <p className="m-0 font-bold text-brand-dark">{extractName(item)}</p>
              <pre className="m-0 mt-[var(--spacing-sm)] max-h-[180px] overflow-auto text-xs text-muted">
                {JSON.stringify(item, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return (
      <FifteenAcShell title={title} eyebrow={eyebrow}>
        <ErrorBlock message={error instanceof Error ? error.message : 'Unable to load records'} />
      </FifteenAcShell>
    );
  }
}

export async function AccountsScreen() {
  try {
    const accounts = await fetchFifteenAcJson<FifteenAcAccount[]>('/accounts');

    return (
      <FifteenAcShell title="Accounts" eyebrow="Cash, banks, and wallets">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add account" action={createAccountAction}>
            <TextField name="name" label="Name" placeholder="Main checking" required />
            <TextField name="institutionName" label="Institution" placeholder="Bank or wallet" />
            <SelectField name="type" label="Type" options={accountTypeOptions} />
            <CurrencyField />
            <SubmitButton label="Save account" />
          </FormPanel>
          <RecordGrid emptyLabel="No accounts yet.">
            {accounts.map((account) => (
              <RecordCard
                key={account.id}
                title={account.name}
                meta={`${account.type} · ${account.currencyCode}`}
              >
                {account.institutionName ? (
                  <p className="m-0 text-muted">{account.institutionName}</p>
                ) : null}
              </RecordCard>
            ))}
          </RecordGrid>
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Accounts', 'Cash, banks, and wallets', error);
  }
}

export async function CardsScreen() {
  try {
    const cards = await fetchFifteenAcJson<FifteenAcCreditCard[]>('/credit-cards');

    return (
      <FifteenAcShell title="Cards" eyebrow="Credit limits, cut dates, and due dates">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add credit card" action={createCreditCardAction}>
            <TextField name="name" label="Name" placeholder="Visa Black" required />
            <TextField name="issuer" label="Issuer" placeholder="Bank/entity" required />
            <TextField
              name="last4"
              label="Last 4 digits"
              placeholder="1234"
              maxLength={4}
              required
            />
            <NumberField name="creditLimit" label="Credit limit" min="0" step="0.01" required />
            <CurrencyField />
            <NumberField name="cutDay" label="Cut day" min="1" max="31" step="1" required />
            <NumberField
              name="paymentDueDay"
              label="Payment due day"
              min="1"
              max="31"
              step="1"
              required
            />
            <NumberField
              name="interestRateMonthly"
              label="Monthly interest rate"
              min="0"
              step="0.0001"
            />
            <SubmitButton label="Save card" />
          </FormPanel>
          <RecordGrid emptyLabel="No cards yet.">
            {cards.map((card) => (
              <RecordCard
                key={card.id}
                title={`${card.name} *${card.last4}`}
                meta={`${card.issuer} · ${formatMoney(card.creditLimit, card.currencyCode)}`}
              >
                <p className="m-0 text-muted">
                  Cut day {card.cutDay} · Due day {card.paymentDueDay}
                  {card.interestRateMonthly ? ` · Rate ${card.interestRateMonthly}%` : ''}
                </p>
              </RecordCard>
            ))}
          </RecordGrid>
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Cards', 'Credit limits, cut dates, and due dates', error);
  }
}

export async function IncomeScreen() {
  try {
    const incomeSources = await fetchFifteenAcJson<FifteenAcIncomeSource[]>('/income-sources');

    return (
      <FifteenAcShell title="Income" eyebrow="Expected income sources">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add income source" action={createIncomeSourceAction}>
            <TextField name="name" label="Name" placeholder="Salary, client, business" required />
            <SelectField name="type" label="Type" options={incomeTypeOptions} />
            <NumberField
              name="expectedAmount"
              label="Expected amount"
              min="0"
              step="0.01"
              required
            />
            <CurrencyField />
            <SelectField name="frequency" label="Frequency" options={frequencyOptions} />
            <NumberField
              name="expectedPaymentDay"
              label="Expected payment day"
              min="1"
              max="31"
              step="1"
            />
            <SubmitButton label="Save income source" />
          </FormPanel>
          <RecordGrid emptyLabel="No income sources yet.">
            {incomeSources.map((source) => (
              <RecordCard
                key={source.id}
                title={source.name}
                meta={`${source.type} · ${formatMoney(source.expectedAmount, source.currencyCode)}`}
              >
                <p className="m-0 text-muted">
                  {source.frequency}
                  {source.expectedPaymentDay ? ` · expected day ${source.expectedPaymentDay}` : ''}
                </p>
              </RecordCard>
            ))}
          </RecordGrid>
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Income', 'Expected income sources', error);
  }
}

export async function FixedObligationsScreen() {
  try {
    const [items, accounts, cards, categories] = await Promise.all([
      fetchFifteenAcJson<FifteenAcRecurring[]>('/fixed-obligations'),
      fetchFifteenAcJson<FifteenAcAccount[]>('/accounts'),
      fetchFifteenAcJson<FifteenAcCreditCard[]>('/credit-cards'),
      fetchFifteenAcJson<FifteenAcCategory[]>('/categories'),
    ]);

    return (
      <FifteenAcShell title="Fixed obligations" eyebrow="Recurring payments with due dates">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add fixed expense" action={createFixedObligationAction}>
            <TextField name="name" label="Name" placeholder="Rent, insurance, loan" required />
            <NumberField name="amount" label="Amount" min="0" step="0.01" required />
            <CurrencyField />
            <SelectField name="frequency" label="Frequency" options={frequencyOptions} />
            <NumberField name="dueDay" label="Due day" min="1" max="31" step="1" />
            <PaymentFields accounts={accounts} cards={cards} categories={categories} />
            <SubmitButton label="Save obligation" />
          </FormPanel>
          <RecurringList items={items} emptyLabel="No fixed obligations yet." editableFixed />
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Fixed obligations', 'Recurring payments with due dates', error);
  }
}

export async function SubscriptionsScreen() {
  try {
    const [items, accounts, cards, categories] = await Promise.all([
      fetchFifteenAcJson<FifteenAcRecurring[]>('/subscriptions'),
      fetchFifteenAcJson<FifteenAcAccount[]>('/accounts'),
      fetchFifteenAcJson<FifteenAcCreditCard[]>('/credit-cards'),
      fetchFifteenAcJson<FifteenAcCategory[]>('/categories'),
    ]);

    return (
      <FifteenAcShell title="Subscriptions" eyebrow="Recurring merchant charges">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add subscription" action={createSubscriptionAction}>
            <TextField
              name="name"
              label="Name"
              placeholder="Streaming, software, membership"
              required
            />
            <NumberField name="amount" label="Amount" min="0" step="0.01" required />
            <CurrencyField />
            <SelectField name="frequency" label="Frequency" options={frequencyOptions} />
            <TextField name="nextBillingDate" label="Next billing date" type="date" />
            <PaymentFields accounts={accounts} cards={cards} categories={categories} />
            <SubmitButton label="Save subscription" />
          </FormPanel>
          <RecurringList items={items} emptyLabel="No subscriptions yet." />
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Subscriptions', 'Recurring merchant charges', error);
  }
}

export async function CategoriesScreen() {
  try {
    const categories = await fetchFifteenAcJson<FifteenAcCategory[]>('/categories');

    return (
      <FifteenAcShell title="Categories" eyebrow="Reporting and review classification">
        <div className="grid gap-[var(--spacing-md)] lg:grid-cols-[360px_1fr]">
          <FormPanel title="Add category" action={createCategoryAction}>
            <TextField name="name" label="Name" placeholder="Groceries, housing, health" required />
            <SubmitButton label="Save category" />
          </FormPanel>
          <RecordGrid emptyLabel="No categories yet.">
            {categories.map((category) => (
              <RecordCard key={category.id} title={category.name} meta="Category" />
            ))}
          </RecordGrid>
        </div>
      </FifteenAcShell>
    );
  } catch (error) {
    return fifteenAcErrorShell('Categories', 'Reporting and review classification', error);
  }
}

function fifteenAcErrorShell(title: string, eyebrow: string, error: unknown) {
  return (
    <FifteenAcShell title={title} eyebrow={eyebrow}>
      <ErrorBlock
        message={error instanceof Error ? error.message : 'Unable to load fifteenAc data'}
      />
    </FifteenAcShell>
  );
}

function Breakdown({
  title,
  items,
  currencyCode,
}: {
  title: string;
  items: Array<{ name: string; amount: number }>;
  currencyCode: string;
}) {
  return (
    <article className={panelClassName}>
      <h2 className="m-0 font-amaranth text-xl text-brand-dark">{title}</h2>
      <div className="mt-[var(--spacing-sm)] grid gap-[var(--spacing-sm)]">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-[var(--spacing-md)]"
          >
            <span>{item.name}</span>
            <strong>{formatMoney(item.amount, currencyCode)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function extractId(item: unknown, index: number): string {
  if (item && typeof item === 'object' && 'id' in item && typeof item.id === 'string') {
    return item.id;
  }
  return String(index);
}

function extractName(item: unknown): string {
  if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
    return item.name;
  }
  if (item && typeof item === 'object' && 'provider' in item && typeof item.provider === 'string') {
    return item.provider;
  }
  return 'Record';
}

async function createAccountAction(formData: FormData) {
  'use server';
  await postFifteenAcJson(
    '/accounts',
    getFormPayload(formData, ['name', 'institutionName', 'type', 'currencyCode']),
  );
  redirect('/accounts');
}

async function createCreditCardAction(formData: FormData) {
  'use server';
  await postFifteenAcJson(
    '/credit-cards',
    getFormPayload(formData, [
      'name',
      'issuer',
      'last4',
      'creditLimit',
      'currencyCode',
      'interestRateMonthly',
      'cutDay',
      'paymentDueDay',
    ]),
  );
  redirect('/cards');
}

async function createIncomeSourceAction(formData: FormData) {
  'use server';
  await postFifteenAcJson(
    '/income-sources',
    getFormPayload(formData, [
      'name',
      'type',
      'expectedAmount',
      'currencyCode',
      'frequency',
      'expectedPaymentDay',
    ]),
  );
  redirect('/income');
}

async function createFixedObligationAction(formData: FormData) {
  'use server';
  await postFifteenAcJson(
    '/fixed-obligations',
    getFormPayload(formData, [
      'name',
      'amount',
      'currencyCode',
      'frequency',
      'dueDay',
      'paymentMethodType',
      'accountId',
      'creditCardId',
      'categoryId',
    ]),
  );
  redirect('/fixed-obligations');
}

async function updateFixedObligationAction(formData: FormData) {
  'use server';
  const id = formData.get('id');
  if (typeof id === 'string' && id.length > 0) {
    await patchFifteenAcJson(`/fixed-obligations/${id}`, {
      name: getString(formData.get('name')),
      amount: getNumber(formData.get('amount')),
      dueDay: getNumber(formData.get('dueDay')),
    });
  }
  redirect('/fixed-obligations');
}

async function createSubscriptionAction(formData: FormData) {
  'use server';
  await postFifteenAcJson(
    '/subscriptions',
    getFormPayload(formData, [
      'name',
      'amount',
      'currencyCode',
      'frequency',
      'nextBillingDate',
      'paymentMethodType',
      'accountId',
      'creditCardId',
      'categoryId',
    ]),
  );
  redirect('/subscriptions');
}

async function createCategoryAction(formData: FormData) {
  'use server';
  await postFifteenAcJson('/categories', getFormPayload(formData, ['name']));
  redirect('/settings/categories');
}

function getFormPayload(formData: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(
    keys
      .map((key) => [key, formData.get(key)])
      .filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' && entry[1].trim().length > 0,
      )
      .map(([key, value]) => [key, value.trim()]),
  );
}

function FormPanel({
  title,
  action,
  children,
}: {
  title: string;
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className={cx(panelClassName, 'grid content-start gap-3')}>
      <h2 className="m-0 font-amaranth text-xl text-brand-dark">{title}</h2>
      {children}
    </form>
  );
}

function TextField({
  name,
  label,
  placeholder,
  type = 'text',
  required,
  maxLength,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className={fieldClasses.label}>
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={fieldClasses.control}
      />
    </label>
  );
}

function NumberField(props: {
  name: string;
  label: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className={fieldClasses.label}>
      {props.label}
      <input
        name={props.name}
        type="number"
        min={props.min}
        max={props.max}
        step={props.step}
        required={props.required}
        className={fieldClasses.control}
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className={fieldClasses.label}>
      {label}
      <select name={name} className={fieldClasses.control}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CurrencyField() {
  return (
    <TextField name="currencyCode" label="Currency" placeholder="COP" required maxLength={3} />
  );
}

function PaymentFields({
  accounts,
  cards,
  categories,
}: {
  accounts: FifteenAcAccount[];
  cards: FifteenAcCreditCard[];
  categories: FifteenAcCategory[];
}) {
  return (
    <>
      <SelectField name="paymentMethodType" label="Payment method" options={paymentMethodOptions} />
      <SelectWithEmpty
        name="accountId"
        label="Account"
        options={accounts.map((item) => ({ value: item.id, label: item.name }))}
      />
      <SelectWithEmpty
        name="creditCardId"
        label="Credit card"
        options={cards.map((item) => ({ value: item.id, label: `${item.name} *${item.last4}` }))}
      />
      <SelectWithEmpty
        name="categoryId"
        label="Category"
        options={categories.map((item) => ({ value: item.id, label: item.name }))}
      />
    </>
  );
}

function SelectWithEmpty({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className={fieldClasses.label}>
      {label}
      <select name={name} className={fieldClasses.control}>
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return <button className={darkSubmitButtonClassName}>{label}</button>;
}

function RecordGrid({ children, emptyLabel }: { children: React.ReactNode; emptyLabel: string }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return hasChildren ? (
    <div className="grid content-start gap-[var(--spacing-sm)] md:grid-cols-2">{children}</div>
  ) : (
    <div className={cx(panelClassName, 'text-muted')}>{emptyLabel}</div>
  );
}

function RecordCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children?: React.ReactNode;
}) {
  return (
    <article className={panelClassName}>
      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">{meta}</p>
      <h3 className="m-0 mt-1 font-amaranth text-lg text-brand-dark">{title}</h3>
      {children}
    </article>
  );
}

function RecurringList({
  items,
  emptyLabel,
  editableFixed = false,
}: {
  items: FifteenAcRecurring[];
  emptyLabel: string;
  editableFixed?: boolean;
}) {
  return (
    <RecordGrid emptyLabel={emptyLabel}>
      {items.map((item) => (
        <RecordCard
          key={item.id}
          title={item.name}
          meta={`${item.frequency} · ${formatMoney(item.amount, item.currencyCode)}`}
        >
          <p className="m-0 text-muted">
            {item.dueDay
              ? `Due day ${item.dueDay}`
              : item.nextBillingDate
                ? `Next ${formatDate(item.nextBillingDate)}`
                : 'No date set'}
            {item.category?.name ? ` · ${item.category.name}` : ''}
          </p>
          <p className="m-0 mt-1 text-sm text-muted">
            {item.paymentMethodType}
            {item.account?.name ? ` · ${item.account.name}` : ''}
            {item.creditCard?.name ? ` · ${item.creditCard.name} *${item.creditCard.last4}` : ''}
          </p>
          {item.billingStatus ? (
            <div className={cx(insetClassName, 'mt-[var(--spacing-sm)] bg-surface-inset-strong')}>
              <p className="m-0 text-sm font-bold text-brand-dark">
                {item.billingStatus.status === 'paid' ? 'Paid this cycle' : 'Pending this cycle'}
              </p>
              <p className="m-0 mt-1 text-sm text-muted">
                Expected {formatMoney(item.billingStatus.expectedAmount, item.currencyCode)}
                {item.billingStatus.paidAmount !== null
                  ? ` · paid ${formatMoney(item.billingStatus.paidAmount, item.currencyCode)}`
                  : ''}
              </p>
              {item.billingStatus.variance !== null ? (
                <p className="m-0 mt-1 text-sm font-bold text-brand-dark">
                  {item.billingStatus.varianceType === 'overcost'
                    ? 'Overcost'
                    : item.billingStatus.varianceType === 'reduction'
                      ? 'Reduction'
                      : 'Matched'}{' '}
                  {formatMoney(Math.abs(item.billingStatus.variance), item.currencyCode)}
                </p>
              ) : null}
            </div>
          ) : null}
          {editableFixed ? (
            <form
              action={updateFixedObligationAction}
              className="mt-[var(--spacing-sm)] grid gap-2"
            >
              <input type="hidden" name="id" value={item.id} />
              <label className={fieldClasses.label}>
                Expected amount
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={String(item.amount)}
                  className={fieldClasses.control}
                />
              </label>
              <label className={fieldClasses.label}>
                Name
                <input name="name" defaultValue={item.name} className={fieldClasses.control} />
              </label>
              <label className={fieldClasses.label}>
                Due day
                <input
                  name="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  step="1"
                  defaultValue={item.dueDay ?? ''}
                  className={fieldClasses.control}
                />
              </label>
              <button className={outlineButtonClassName}>Save expected bill</button>
            </form>
          ) : null}
        </RecordCard>
      ))}
    </RecordGrid>
  );
}

const accountTypeOptions = [
  { value: 'CHECKING', label: 'Checking' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'CASH', label: 'Cash' },
  { value: 'DIGITAL_WALLET', label: 'Digital wallet' },
  { value: 'OTHER', label: 'Other' },
];

const incomeTypeOptions = [
  { value: 'SALARY', label: 'Salary' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'OTHER', label: 'Other' },
];

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'irregular', label: 'Irregular' },
];

const paymentMethodOptions = [
  { value: 'account', label: 'Account' },
  { value: 'credit_card', label: 'Credit card' },
  { value: 'cash', label: 'Cash' },
  { value: 'external', label: 'External' },
  { value: 'unknown', label: 'Unknown' },
];
