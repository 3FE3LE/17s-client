import type {
  AllCheckDashboardOverview,
  AllCheckReviewItem,
  AllCheckTransaction,
} from '@17suit/module-fifteen-all-check';
import { cardRecipe, cx, inputRecipe } from '@17suit/ui';
import { redirect } from 'next/navigation';
import { DataCard, ErrorBlock, AllCheckShell } from './all-check-shell';
import { fetchAllCheckJson, patchAllCheckJson, postAllCheckJson } from '@/lib/all-check-server';
import { formatDate, formatMoney } from '@/lib/format';

type AllCheckTransactionCandidate = {
  id: string;
  candidateType: string;
  amount: string | number;
  currencyCode: string;
  occurredAt: string;
  merchantNameRaw?: string | null;
  cardLast4?: string | null;
  referenceCode?: string | null;
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

type AllCheckAccount = {
  id: string;
  name: string;
  type: string;
  institutionName?: string | null;
  currencyCode: string;
};

type AllCheckCreditCard = {
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

type AllCheckCategory = {
  id: string;
  name: string;
  color?: string | null;
};

type AllCheckIncomeSource = {
  id: string;
  name: string;
  type: string;
  expectedAmount: string | number;
  currencyCode: string;
  frequency: string;
  expectedPaymentDay?: number | null;
};

type AllCheckRecurring = {
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

export async function DashboardScreen() {
  try {
    const data = await fetchAllCheckJson<AllCheckDashboardOverview>('/dashboard/overview');

    return (
      <AllCheckShell title="Fifteen All Check" eyebrow="Financial cockpit">
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
      </AllCheckShell>
    );
  } catch (error) {
    return (
      <AllCheckShell title="Fifteen All Check" eyebrow="Financial cockpit">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'Unable to load allCheck data'}
        />
      </AllCheckShell>
    );
  }
}

export async function TransactionsScreen() {
  try {
    const items = await fetchAllCheckJson<AllCheckTransaction[]>('/transactions');

    return (
      <AllCheckShell title="Transactions" eyebrow="Confirmed ledger">
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
      </AllCheckShell>
    );
  } catch (error) {
    return (
      <AllCheckShell title="Transactions" eyebrow="Confirmed ledger">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'Unable to load transactions'}
        />
      </AllCheckShell>
    );
  }
}

export async function ReviewScreen() {
  try {
    const [items, candidates] = await Promise.all([
      fetchAllCheckJson<AllCheckReviewItem[]>('/review-items'),
      fetchAllCheckJson<AllCheckTransactionCandidate[]>('/transaction-candidates'),
    ]);
    const pendingCandidates = candidates.filter(
      (candidate) => candidate.status === 'PENDING_REVIEW',
    );

    return (
      <AllCheckShell title="Review queue" eyebrow="Candidates and evidence">
        <div className="grid gap-[var(--spacing-md)]">
          <section className="grid gap-[var(--spacing-sm)]">
            <h2 className="m-0 font-amaranth text-xl text-brand-dark">Parsed candidates</h2>
            {pendingCandidates.length === 0 ? (
              <div className={cx(panelClassName, 'text-muted')}>No pending candidates yet.</div>
            ) : (
              pendingCandidates.map((candidate) => (
                <article
                  key={candidate.id}
                  className={cx(
                    panelClassName,
                    'grid gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1fr)_340px]',
                  )}
                >
                  <div>
                    <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                      {candidate.candidateType} · confidence{' '}
                      {Math.round(Number(candidate.confidenceScore) * 100)}%
                    </p>
                    <h3 className="m-0 mt-1 font-amaranth text-lg text-brand-dark">
                      {candidate.merchantNameRaw ??
                        candidate.rawEmail?.fromEmail ??
                        'Email candidate'}
                    </h3>
                    <p className="m-0 mt-1 text-muted">
                      {formatDate(candidate.occurredAt)} ·{' '}
                      {formatMoney(candidate.amount, candidate.currencyCode)}
                      {candidate.cardLast4 ? ` · card *${candidate.cardLast4}` : ''}
                    </p>
                    {candidate.rawEmail ? (
                      <div className={cx(insetClassName, 'mt-[var(--spacing-sm)] grid gap-1')}>
                        <p className="m-0 text-sm font-bold text-brand-dark">
                          {candidate.rawEmail.subject}
                        </p>
                        <p className="m-0 break-all text-xs text-muted">
                          {candidate.rawEmail.fromEmail}
                        </p>
                        {candidate.rawEmail.snippet ? (
                          <p className="m-0 text-sm text-muted">{candidate.rawEmail.snippet}</p>
                        ) : null}
                        <p className="m-0 text-xs text-muted">
                          Detected: {candidate.rawEmail.eventType ?? candidate.candidateType} ·{' '}
                          {candidate.rawEmail.financialImpactType ?? 'UNKNOWN'}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <form action={updateCandidateAction} className="grid gap-2">
                      <input type="hidden" name="candidateId" value={candidate.id} />
                      <label className="grid gap-1 text-sm font-bold text-brand-dark">
                        Type
                        <select
                          name="candidateType"
                          defaultValue={candidate.candidateType}
                          className={fieldClasses.control}
                        >
                          {candidateTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm font-bold text-brand-dark">
                        Name / merchant
                        <input
                          name="merchantNameRaw"
                          defaultValue={candidate.merchantNameRaw ?? ''}
                          className={fieldClasses.control}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Amount
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
                          Currency
                          <input
                            name="currencyCode"
                            maxLength={3}
                            defaultValue={candidate.currencyCode}
                            className={cx(fieldClasses.control, 'uppercase')}
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Card last 4
                          <input
                            name="cardLast4"
                            maxLength={4}
                            defaultValue={candidate.cardLast4 ?? ''}
                            className={fieldClasses.control}
                          />
                        </label>
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Reference
                          <input
                            name="referenceCode"
                            defaultValue={candidate.referenceCode ?? ''}
                            className={fieldClasses.control}
                          />
                        </label>
                      </div>
                      <button className={outlineButtonClassName}>Save classification</button>
                    </form>
                    <form action={acceptCandidateAction}>
                      <input type="hidden" name="candidateId" value={candidate.id} />
                      <button className={cx(darkSubmitButtonClassName, 'w-full')}>Accept</button>
                    </form>
                    <form action={rejectCandidateAction}>
                      <input type="hidden" name="candidateId" value={candidate.id} />
                      <button className={cx(outlineButtonClassName, 'w-full')}>Reject</button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="grid gap-[var(--spacing-sm)]">
            <h2 className="m-0 font-amaranth text-xl text-brand-dark">Review items</h2>
            {items.map((item) => {
              const payload = extractReviewPayload(item.payloadJson);
              return (
                <article
                  key={item.id}
                  className={cx(
                    panelClassName,
                    'grid gap-[var(--spacing-md)] lg:grid-cols-[minmax(0,1fr)_340px]',
                  )}
                >
                  <div>
                    <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
                      {item.type}
                    </p>
                    <h3 className="m-0 mt-1 font-amaranth text-lg text-brand-dark">
                      {payload.title}
                    </h3>
                    <p className="m-0 mt-1 text-muted">
                      {item.status} · {formatDate(item.createdAt)}
                      {payload.eventType ? ` · ${payload.eventType}` : ''}
                      {payload.financialImpactType ? ` · ${payload.financialImpactType}` : ''}
                    </p>
                    {payload.rawEmail ? (
                      <div className={cx(insetClassName, 'mt-[var(--spacing-sm)] grid gap-1')}>
                        <p className="m-0 text-sm font-bold text-brand-dark">
                          {payload.rawEmail.subject}
                        </p>
                        <p className="m-0 break-all text-xs text-muted">
                          {payload.rawEmail.fromName ? `${payload.rawEmail.fromName} · ` : ''}
                          {payload.rawEmail.fromEmail}
                        </p>
                        {payload.rawEmail.snippet ? (
                          <p className="m-0 text-sm text-muted">{payload.rawEmail.snippet}</p>
                        ) : null}
                      </div>
                    ) : null}
                    {payload.extractedSummary ? (
                      <p className="m-0 mt-2 text-sm font-bold text-brand-dark">
                        Extracted: {payload.extractedSummary}
                      </p>
                    ) : null}
                  </div>
                  {payload.rawEmailId && item.status === 'OPEN' ? (
                    <form action={createCandidateFromReviewItemAction} className="grid gap-2">
                      <input type="hidden" name="rawEmailId" value={payload.rawEmailId} />
                      <label className="grid gap-1 text-sm font-bold text-brand-dark">
                        Type
                        <select
                          name="candidateType"
                          defaultValue={payload.suggestedCandidateType ?? 'PURCHASE'}
                          className={fieldClasses.control}
                        >
                          {candidateTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm font-bold text-brand-dark">
                        Name / merchant
                        <input
                          name="merchantNameRaw"
                          defaultValue={payload.merchantNameRaw ?? payload.rawEmail?.fromName ?? ''}
                          className={fieldClasses.control}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Amount
                          <input
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={payload.amount ?? ''}
                            className={fieldClasses.control}
                          />
                        </label>
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Currency
                          <input
                            name="currencyCode"
                            maxLength={3}
                            defaultValue={payload.currencyCode ?? 'COP'}
                            className={cx(fieldClasses.control, 'uppercase')}
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Card last 4
                          <input
                            name="cardLast4"
                            maxLength={4}
                            defaultValue={payload.cardLast4 ?? ''}
                            className={fieldClasses.control}
                          />
                        </label>
                        <label className="grid gap-1 text-sm font-bold text-brand-dark">
                          Reference
                          <input
                            name="referenceCode"
                            defaultValue={payload.referenceCode ?? ''}
                            className={fieldClasses.control}
                          />
                        </label>
                      </div>
                      <button className={darkSubmitButtonClassName}>Create candidate</button>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </section>
        </div>
      </AllCheckShell>
    );
  } catch (error) {
    return (
      <AllCheckShell title="Review queue" eyebrow="Candidates and evidence">
        <ErrorBlock
          message={error instanceof Error ? error.message : 'Unable to load review queue'}
        />
      </AllCheckShell>
    );
  }
}

async function acceptCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    await postAllCheckJson(`/transaction-candidates/${candidateId}/accept`);
  }
  redirect('/review');
}

async function updateCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    await patchAllCheckJson(`/transaction-candidates/${candidateId}`, {
      candidateType: getString(formData.get('candidateType')),
      amount: getNumber(formData.get('amount')),
      currencyCode: getString(formData.get('currencyCode'))?.toUpperCase(),
      merchantNameRaw: getString(formData.get('merchantNameRaw')) ?? '',
      cardLast4: getString(formData.get('cardLast4')) ?? '',
      referenceCode: getString(formData.get('referenceCode')) ?? '',
    });
  }
  redirect('/review');
}

async function createCandidateFromReviewItemAction(formData: FormData) {
  'use server';

  await postAllCheckJson('/transaction-candidates/from-raw-email', {
    rawEmailId: getString(formData.get('rawEmailId')),
    candidateType: getString(formData.get('candidateType')),
    amount: getNumber(formData.get('amount')),
    currencyCode: getString(formData.get('currencyCode'))?.toUpperCase(),
    merchantNameRaw: getString(formData.get('merchantNameRaw')),
    cardLast4: getString(formData.get('cardLast4')),
    referenceCode: getString(formData.get('referenceCode')),
  });
  redirect('/review');
}

async function rejectCandidateAction(formData: FormData) {
  'use server';

  const candidateId = formData.get('candidateId');
  if (typeof candidateId === 'string' && candidateId.length > 0) {
    await postAllCheckJson(`/transaction-candidates/${candidateId}/reject`);
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
    const items = await fetchAllCheckJson<unknown[]>(endpoint);

    return (
      <AllCheckShell title={title} eyebrow={eyebrow}>
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
      </AllCheckShell>
    );
  } catch (error) {
    return (
      <AllCheckShell title={title} eyebrow={eyebrow}>
        <ErrorBlock message={error instanceof Error ? error.message : 'Unable to load records'} />
      </AllCheckShell>
    );
  }
}

export async function AccountsScreen() {
  try {
    const accounts = await fetchAllCheckJson<AllCheckAccount[]>('/accounts');

    return (
      <AllCheckShell title="Accounts" eyebrow="Cash, banks, and wallets">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Accounts', 'Cash, banks, and wallets', error);
  }
}

export async function CardsScreen() {
  try {
    const cards = await fetchAllCheckJson<AllCheckCreditCard[]>('/credit-cards');

    return (
      <AllCheckShell title="Cards" eyebrow="Credit limits, cut dates, and due dates">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Cards', 'Credit limits, cut dates, and due dates', error);
  }
}

export async function IncomeScreen() {
  try {
    const incomeSources = await fetchAllCheckJson<AllCheckIncomeSource[]>('/income-sources');

    return (
      <AllCheckShell title="Income" eyebrow="Expected income sources">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Income', 'Expected income sources', error);
  }
}

export async function FixedObligationsScreen() {
  try {
    const [items, accounts, cards, categories] = await Promise.all([
      fetchAllCheckJson<AllCheckRecurring[]>('/fixed-obligations'),
      fetchAllCheckJson<AllCheckAccount[]>('/accounts'),
      fetchAllCheckJson<AllCheckCreditCard[]>('/credit-cards'),
      fetchAllCheckJson<AllCheckCategory[]>('/categories'),
    ]);

    return (
      <AllCheckShell title="Fixed obligations" eyebrow="Recurring payments with due dates">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Fixed obligations', 'Recurring payments with due dates', error);
  }
}

export async function SubscriptionsScreen() {
  try {
    const [items, accounts, cards, categories] = await Promise.all([
      fetchAllCheckJson<AllCheckRecurring[]>('/subscriptions'),
      fetchAllCheckJson<AllCheckAccount[]>('/accounts'),
      fetchAllCheckJson<AllCheckCreditCard[]>('/credit-cards'),
      fetchAllCheckJson<AllCheckCategory[]>('/categories'),
    ]);

    return (
      <AllCheckShell title="Subscriptions" eyebrow="Recurring merchant charges">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Subscriptions', 'Recurring merchant charges', error);
  }
}

export async function CategoriesScreen() {
  try {
    const categories = await fetchAllCheckJson<AllCheckCategory[]>('/categories');

    return (
      <AllCheckShell title="Categories" eyebrow="Reporting and review classification">
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
      </AllCheckShell>
    );
  } catch (error) {
    return allCheckErrorShell('Categories', 'Reporting and review classification', error);
  }
}

function allCheckErrorShell(title: string, eyebrow: string, error: unknown) {
  return (
    <AllCheckShell title={title} eyebrow={eyebrow}>
      <ErrorBlock
        message={error instanceof Error ? error.message : 'Unable to load allCheck data'}
      />
    </AllCheckShell>
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

function extractReviewPayload(payload: unknown) {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const extracted =
    record.extracted && typeof record.extracted === 'object'
      ? (record.extracted as Record<string, unknown>)
      : {};
  const rawEmail =
    record.rawEmail && typeof record.rawEmail === 'object'
      ? (record.rawEmail as Record<string, unknown>)
      : null;
  const amount = typeof extracted.amount === 'number' ? extracted.amount : undefined;
  const currencyCode =
    typeof extracted.currencyCode === 'string' ? extracted.currencyCode : undefined;
  const merchantNameRaw =
    typeof extracted.merchantNameRaw === 'string' ? extracted.merchantNameRaw : undefined;
  const cardLast4 = typeof extracted.cardLast4 === 'string' ? extracted.cardLast4 : undefined;
  const referenceCode =
    typeof extracted.referenceCode === 'string' ? extracted.referenceCode : undefined;

  return {
    title: typeof record.title === 'string' ? record.title : 'Review item',
    rawEmailId: typeof record.rawEmailId === 'string' ? record.rawEmailId : undefined,
    eventType: typeof record.eventType === 'string' ? record.eventType : undefined,
    financialImpactType:
      typeof record.financialImpactType === 'string' ? record.financialImpactType : undefined,
    suggestedCandidateType: suggestCandidateType(record.eventType, record.financialImpactType),
    amount,
    currencyCode,
    merchantNameRaw,
    cardLast4,
    referenceCode,
    extractedSummary: [
      amount !== undefined && currencyCode ? `${currencyCode} ${amount}` : null,
      merchantNameRaw,
      cardLast4 ? `card *${cardLast4}` : null,
      referenceCode,
    ]
      .filter(Boolean)
      .join(' · '),
    rawEmail: rawEmail
      ? {
          fromEmail: typeof rawEmail.fromEmail === 'string' ? rawEmail.fromEmail : undefined,
          fromName: typeof rawEmail.fromName === 'string' ? rawEmail.fromName : undefined,
          subject: typeof rawEmail.subject === 'string' ? rawEmail.subject : 'Email evidence',
          snippet: typeof rawEmail.snippet === 'string' ? rawEmail.snippet : undefined,
        }
      : null,
  };
}

function suggestCandidateType(eventType: unknown, impactType: unknown): string | undefined {
  if (eventType === 'SUBSCRIPTION_CHARGE') return 'SUBSCRIPTION';
  if (
    eventType === 'BILL_ISSUED' ||
    eventType === 'BILL_DUE_REMINDER' ||
    impactType === 'CREATES_PAYABLE'
  ) {
    return 'FIXED_OBLIGATION';
  }
  if (eventType === 'CARD_PAYMENT_CONFIRMATION') return 'CARD_PAYMENT';
  if (impactType === 'CREATES_INCOME') return 'INCOME';
  return undefined;
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
  await postAllCheckJson(
    '/accounts',
    getFormPayload(formData, ['name', 'institutionName', 'type', 'currencyCode']),
  );
  redirect('/accounts');
}

async function createCreditCardAction(formData: FormData) {
  'use server';
  await postAllCheckJson(
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
  await postAllCheckJson(
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
  await postAllCheckJson(
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
    await patchAllCheckJson(`/fixed-obligations/${id}`, {
      name: getString(formData.get('name')),
      amount: getNumber(formData.get('amount')),
      dueDay: getNumber(formData.get('dueDay')),
    });
  }
  redirect('/fixed-obligations');
}

async function createSubscriptionAction(formData: FormData) {
  'use server';
  await postAllCheckJson(
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
  await postAllCheckJson('/categories', getFormPayload(formData, ['name']));
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
  accounts: AllCheckAccount[];
  cards: AllCheckCreditCard[];
  categories: AllCheckCategory[];
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
  items: AllCheckRecurring[];
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
