import { RetryStrategy } from '../http-retry-strategies.interface';

/**
 * Implements a retry strategy based on the Fibonacci sequence, where the delay before each retry attempt
 * corresponds to the value of the Fibonacci sequence at the attempt index, multiplied by the initial delay.
 * This strategy provides a progressively increasing delay that follows the natural growth pattern of the Fibonacci sequence.
 */
export class FibonacciBackoffRetryStrategy implements RetryStrategy {
  /**
   * @param {number} _maxAttempts - The maximum number of retry attempts.
   * @param {number} _initialDelayMs - The delay in milliseconds before the first retry and which
   *  serves as the base for calculating the fibonacci backoff.
   */
  constructor(
    private readonly _maxAttempts: number,
    private readonly _initialDelayMs: number = 1000,
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
   * @returns {number} - The fixed interval delay in milliseconds.
   */
  get maxAttempts(): number {
    return this._maxAttempts;
  }

  /**
   * Gets the delay duration in milliseconds before the next retry attempt.
   * @param {number} attempt - The current attempt count.
   * @returns {number} - The computed delay in milliseconds, following the formula delay = initialDelayMs * (2^attempt).
   * The delay is capped at Number.MAX_SAFE_INTEGER to prevent Integer overflow.
   */
  getDelayMs(attempt: number): number {
    return this._initialDelayMs * this.fibonacci(attempt);
  }

  /**
   * Computes the Fibonacci number at the given position.
   * As retries use 0-based indexing, position 1 and 2 return 1 to start the sequence.
   *
   * @param {number} position - The index in the Fibonacci sequence.
   * @returns {number} - The Fibonacci number.
   */
  private fibonacci(position: number): number {
    if (position === 0 || position === 1) {
      return 1;
    }

    let previous = 1;
    let current = 1;

    for (let i = 2; i <= position; i++) {
      const next = previous + current;
      previous = current;
      current = next;
    }

    return current;
  }
}
