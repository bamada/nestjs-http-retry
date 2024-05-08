import { RetryStrategy } from '../http-retry-strategies.interface';

/**
 * Implements a retry strategy with a delay that grows polynomially with each attempt.
 */
export class PolynomialBackoffRetryStrategy implements RetryStrategy {
  /**
   * Initializes the polynomial backoff retry strategy with given parameters.
   *
   * @param {number} _maxAttempts The maximum number of retry attempts.
   * @param {number} _initialDelayMs The initial delay in milliseconds that is used as the base for the polynomial calculation.
   * @param {number} _degree The degree of the polynomial function to calculate the delay.
   */
  constructor(
    private readonly _maxAttempts: number,
    private readonly _initialDelayMs: number,
    private readonly _degree: number,
  ) {
    if (_maxAttempts < 1) throw new Error('Max attempts must be at least 1.');
    if (_initialDelayMs <= 0) {
      throw new Error('Initial delay must be greater than 0.');
    }
    if (!Number.isInteger(_degree) || _degree < 1) {
      throw new Error('Degree must be a positive integer.');
    }
    Object.freeze(this);
  }

  /**
   * Determines if a retry should be attempted based on the number of attempts already made.
   *
   * @param {number} attempt The current attempt count starting from zero for the first retry.
   * @returns {boolean} True if the number of attempts is less than the maximum allowed, indicating a retry should occur.
   */
  shouldRetry(attempt: number): boolean {
    return attempt < this.maxAttempts;
  }

  /**
   * Computes the delay before the next retry attempt according to a polynomial function of the attempt count.
   *
   * @param {number} attempt The current attempt count.
   * @returns {number} The computed delay in milliseconds for the polynomial backoff strategy.
   */
  getDelayMs(attempt: number): number {
    const delay = Math.min(
      this._initialDelayMs * attempt ** this._degree,
      Number.MAX_SAFE_INTEGER,
    );
    return delay;
  }

  /**
   * Retrieves the maximum number of retry attempts defined in the strategy.
   * @returns {number} - The maximum number of attempts that will be allowed by the retry strategy.
   */
  get maxAttempts(): number {
    return this._maxAttempts;
  }
}
