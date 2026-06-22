import { z } from 'zod';

export const FifteenAllCheckFeatureFlags = {
  enableOutlookIngestion: 'fifteen-all-check.enable_outlook_ingestion',
  enableReviewQueue: 'fifteen-all-check.enable_review_queue',
} as const;

export const AllCheckMoneySchema = z.object({
  amount: z.number(),
  currencyCode: z.string().min(3).max(3),
});

export const AllCheckDashboardOverviewSchema = z.object({
  month: z.string(),
  currencyCode: z.string(),
  incomeReceived: z.number(),
  expenses: z.number(),
  estimatedBalanceImpact: z.number(),
  upcomingObligations: z.number(),
  pendingReviewItems: z.number(),
  topCategories: z.array(z.object({ name: z.string(), amount: z.number() })),
  topMerchants: z.array(z.object({ name: z.string(), amount: z.number() })),
  creditCards: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
      last4: z.string(),
      creditLimit: z.number(),
      cutDay: z.number(),
      paymentDueDay: z.number(),
      currentCycle: z.unknown().nullable(),
    }),
  ),
});

export type AllCheckDashboardOverview = z.infer<typeof AllCheckDashboardOverviewSchema>;

export interface AllCheckTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'refund' | 'fee' | 'adjustment';
  amount: string | number;
  currencyCode: string;
  occurredAt: string;
  description?: string | null;
  status: string;
  origin: string;
  merchant?: { name: string } | null;
  category?: { name: string } | null;
  account?: { name: string } | null;
  creditCard?: { name: string; last4: string } | null;
  evidence?: Array<{ id: string }>;
}

export interface AllCheckReviewItem {
  id: string;
  type: string;
  status: string;
  payloadJson: unknown;
  createdAt: string;
}

export interface AllCheckApi {
  getOverview: () => Promise<AllCheckDashboardOverview>;
  listTransactions: () => Promise<AllCheckTransaction[]>;
  listReviewItems: () => Promise<AllCheckReviewItem[]>;
  listCreditCards: () => Promise<unknown[]>;
  listAccounts: () => Promise<unknown[]>;
  listIncomeSources: () => Promise<unknown[]>;
  listFixedObligations: () => Promise<unknown[]>;
  listSubscriptions: () => Promise<unknown[]>;
  listEmailSources: () => Promise<unknown[]>;
  listCategories: () => Promise<unknown[]>;
}

export function createAllCheckApi(baseUrl = '/api/15ac'): AllCheckApi {
  async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`AllCheck request failed (${response.status})`);
    }

    return (await response.json()) as T;
  }

  return {
    async getOverview() {
      return AllCheckDashboardOverviewSchema.parse(await request('/dashboard/overview'));
    },
    listTransactions: () => request('/transactions'),
    listReviewItems: () => request('/review-items'),
    listCreditCards: () => request('/credit-cards'),
    listAccounts: () => request('/accounts'),
    listIncomeSources: () => request('/income-sources'),
    listFixedObligations: () => request('/fixed-obligations'),
    listSubscriptions: () => request('/subscriptions'),
    listEmailSources: () => request('/email-sources'),
    listCategories: () => request('/categories'),
  };
}
