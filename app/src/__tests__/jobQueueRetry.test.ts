import { executeResilientJob } from '../lib/jobQueueRetry';

describe('executeResilientJob', () => {
  it('retries transient failures with exponential backoff and succeeds', async () => {
    let count = 0;
    const { result, metrics } = await executeResilientJob(
      'sync-bank-feed',
      async () => {
        count += 1;
        if (count < 3) throw new Error('Temporary timeout');
        return 'OK';
      },
      { maxAttempts: 3, baseDelayMs: 1 }
    );
    expect(result).toBe('OK');
    expect(metrics.attempts).toBe(3);
    expect(metrics.succeeded).toBe(true);
  });
});
