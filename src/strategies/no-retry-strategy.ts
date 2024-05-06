import { RetryStrategy } from 'src/http-retry-strategies.interface';

/**
 * Implements a strategy that specifies no retries should be made.
 */
export class NoRetryStrategy implements RetryStrategy {
  /**
   * Determines that no retry attempt should occur.
   * @returns {boolean} - Always false, as no retries should be attempted.
   */
  shouldRetry(): boolean {
    return false;
  }

  /**
   * Gets the delay duration, which is always zero since no retries are intended.
   * @returns {number} - Always 0 milliseconds, as no delay is necessary for non-existent retries.
   */
  getDelayMs(): number {
    return 0;
  }

  /**
   * Retrieves the maximum number of retry attempts defined in the strategy.
   * @returns {number} - The maximum number of attempts that will be allowed by the retry strategy.
   */
  get maxAttempts(): number {
    return 0;
  }
}
