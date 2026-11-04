export interface FinancialAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
  fxToBaseRate?: number;
}

export interface MultiAccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  byType: Record<string, number>;
  accountsCount: number;
}

export function aggregateMultiAccountOverview(accounts: FinancialAccount[]): MultiAccountSummary {
  let totalAssets = 0;
  let totalLiabilities = 0;
  const byType: Record<string, number> = {};

  for (const acc of accounts) {
    const rate = acc.fxToBaseRate ?? 1;
    const normalized = Number((acc.balance * rate).toFixed(2));
    byType[acc.type] = Number(((byType[acc.type] || 0) + normalized).toFixed(2));

    if (acc.type === 'credit' || normalized < 0) {
      totalLiabilities += Math.abs(normalized);
    } else {
      totalAssets += normalized;
    }
  }

  return {
    totalAssets: Number(totalAssets.toFixed(2)),
    totalLiabilities: Number(totalLiabilities.toFixed(2)),
    netWorth: Number((totalAssets - totalLiabilities).toFixed(2)),
    byType,
    accountsCount: accounts.length,
  };
}
