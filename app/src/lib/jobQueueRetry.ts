export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
}

export interface JobExecutionMetrics {
  jobName: string;
  attempts: number;
  succeeded: boolean;
  lastError?: string;
}

export async function executeResilientJob<T>(
  jobName: string,
  task: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, baseDelayMs: 10 }
): Promise<{ result?: T; metrics: JobExecutionMetrics }> {
  let attempts = 0;
  let lastError: string | undefined;

  while (attempts < options.maxAttempts) {
    attempts += 1;
    try {
      const result = await task();
      return {
        result,
        metrics: { jobName, attempts, succeeded: true },
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempts < options.maxAttempts) {
        const delay = options.baseDelayMs * Math.pow(2, attempts - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  return {
    metrics: {
      jobName,
      attempts,
      succeeded: false,
      lastError,
    },
  };
}
