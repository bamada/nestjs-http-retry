import { RetryStrategy } from 'src/http-retry-strategies.interface';

/**
 * Implements an exponential backoff retry strategy where the delay between
 * retries increases exponentially with each attempt.
 */
export class ExponentialBackoffRetryStrategy implements RetryStrategy {
  /**
   * @param {number} _maxAttempts - The maximum number of retry attempts.
   * @param {number} _initialDelayMs - The delay in milliseconds before the first retry and which
   *  serves as the base for calculating the exponential backoff.
   */
  constructor(
    private readonly _maxAttempts: number,
    private readonly _initialDelayMs = 1000,
  ) {
    if (_maxAttempts < 1) throw new Error('Max attempts must be at least 1.');
    if (_initialDelayMs <= 0)
      throw new Error('Initial delay must be greater than 0.');

    Object.freeze(this);
  }

  /**
   * Determines if a retry attempt should occur based on the provided attempt count.
   * @param {number} attempt - The current attempt count.
   * @returns {boolean} - True if the current attempt count is less than maxAttempts, otherwise false.
   */
  shouldRetry(attempt: number): boolean {
    return attempt < this._maxAttempts;
  }

  /**
   * Gets the delay duration in milliseconds before the next retry attempt.
   * @param {number} attempt - The current attempt count.
   * @returns {number} - The computed delay in milliseconds, following the formula delay = initialDelayMs * (2^attempt).
   * The delay is capped at Number.MAX_SAFE_INTEGER to prevent Integer overflow.
   */
  getDelayMs(attempt: number): number {
    const delay = this._initialDelayMs * 2 ** attempt;
    return delay < Number.MAX_SAFE_INTEGER ? delay : Number.MAX_SAFE_INTEGER;
  }

  /**
   * Retrieves the maximum number of retry attempts defined in the strategy.
   * @returns {number} - The maximum number of attempts that will be allowed by the retry strategy.
   */
  get maxAttempts(): number {
    return this._maxAttempts;
  }
}
