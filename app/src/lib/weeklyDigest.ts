export interface TransactionRecord {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  merchant?: string;
}

export interface WeeklyDigestSummary {
  weekStart: string;
  weekEnd: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRatePercent: number;
  expenseDeltaPercent: number | null;
  topCategories: Array<{ category: string; amount: number; sharePercent: number }>;
  insights: string[];
}

export function generateWeeklySmartDigest(
  currentWeekTxs: TransactionRecord[],
  previousWeekTxs: TransactionRecord[],
  weekStart: string,
  weekEnd: string
): WeeklyDigestSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals: Record<string, number> = {};

  for (const tx of currentWeekTxs) {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  }

  const prevExpenses = previousWeekTxs
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRatePercent =
    totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(2)) : 0;

  const expenseDeltaPercent =
    prevExpenses > 0
      ? Number((((totalExpenses - prevExpenses) / prevExpenses) * 100).toFixed(2))
      : null;

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      sharePercent: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const insights: string[] = [];
  if (savingsRatePercent >= 20) {
    insights.push(`Strong savings week: you saved ${savingsRatePercent}% of your income.`);
  } else if (totalIncome > 0 && savingsRatePercent < 0) {
    insights.push('Alert: Weekly expenses exceeded weekly income.');
  }

  if (expenseDeltaPercent !== null) {
    if (expenseDeltaPercent > 15) {
      insights.push(`Spending increased by ${expenseDeltaPercent}% compared to last week.`);
    } else if (expenseDeltaPercent < -10) {
      insights.push(`Great job! Spending dropped by ${Math.abs(expenseDeltaPercent)}% week-over-week.`);
    }
  }

  if (topCategories.length > 0) {
    insights.push(
      `Top spending category: ${topCategories[0].category} (${topCategories[0].sharePercent}% of total expenses).`
    );
  }

  return {
    weekStart,
    weekEnd,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRatePercent,
    expenseDeltaPercent,
    topCategories,
    insights,
  };
}
