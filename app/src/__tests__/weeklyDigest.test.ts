import { generateWeeklySmartDigest, TransactionRecord } from '../lib/weeklyDigest';

describe('generateWeeklySmartDigest', () => {
  const current: TransactionRecord[] = [
    { id: '1', date: '2026-11-01', amount: 2000, type: 'income', category: 'Salary' },
    { id: '2', date: '2026-11-02', amount: 500, type: 'expense', category: 'Rent' },
    { id: '3', date: '2026-11-03', amount: 200, type: 'expense', category: 'Food' },
  ];
  const prev: TransactionRecord[] = [
    { id: '0', date: '2026-10-25', amount: 1000, type: 'expense', category: 'Rent' },
  ];

  it('computes weekly totals, savings rate, and week-over-week deltas accurately', () => {
    const summary = generateWeeklySmartDigest(current, prev, '2026-11-01', '2026-11-07');
    expect(summary.totalIncome).toBe(2000);
    expect(summary.totalExpenses).toBe(700);
    expect(summary.netSavings).toBe(1300);
    expect(summary.savingsRatePercent).toBe(65);
    expect(summary.expenseDeltaPercent).toBe(-30);
    expect(summary.topCategories[0].category).toBe('Rent');
    expect(summary.insights.length).toBeGreaterThan(0);
  });
});
