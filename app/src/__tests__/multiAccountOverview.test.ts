import { aggregateMultiAccountOverview } from '../lib/multiAccountOverview';

describe('aggregateMultiAccountOverview', () => {
  it('aggregates assets, liabilities, and net worth across multiple accounts', () => {
    const res = aggregateMultiAccountOverview([
      { id: '1', name: 'Main Checking', type: 'checking', balance: 4000, currency: 'USD' },
      { id: '2', name: 'Index Portfolio', type: 'investment', balance: 12000, currency: 'USD' },
      { id: '3', name: 'Credit Card', type: 'credit', balance: 1500, currency: 'USD' },
    ]);
    expect(res.totalAssets).toBe(16000);
    expect(res.totalLiabilities).toBe(1500);
    expect(res.netWorth).toBe(14500);
    expect(res.accountsCount).toBe(3);
  });
});
