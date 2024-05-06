import { RetryStrategy } from 'src/http-retry-strategies.interface';

/**
 * Implements a retry strategy with a constant delay between retry attempts.
 */
export class ConstantIntervalRetryStrategy implements RetryStrategy {
  /**
   * Creates an instance of `ConstantIntervalRetryStrategy`.
   * @param {number} _maxAttempts - The maximum number of retry attempts.
   * @param {number} _intervalMs - The fixed interval between retries in milliseconds.
   * @throws {Error} - If maxAttempts is less than 1 or intervalMs is less than 0.
   */
  constructor(
    private readonly _maxAttempts: number,
    private readonly _intervalMs: number,
  ) {
    if (_maxAttempts < 1) throw new Error('Max attempts must be at least 1.');
    if (_intervalMs < 0)
      throw new Error('Interval milliseconds must be 0 or greater.');

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
   * @returns {number} - The fixed interval delay in milliseconds.
   */
  getDelayMs(): number {
    return this._intervalMs;
  }

  /**
   * Retrieves the maximum number of retry attempts defined in the strategy.
   * @returns {number} - The maximum number of attempts that will be allowed by the retry strategy.
   */
  get maxAttempts(): number {
    return this._maxAttempts;
  }
}
