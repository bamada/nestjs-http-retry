/**
 * An interface defining the contract for retry strategies.
 * Implementations of this interface determine if a retry should occur
 * and the delay before the next attempt.
 */
export interface RetryStrategy {
  /**
   * Determines whether a retry should be attempted based on the number of attempts made so far.
   *
   * @param {number} attempt - The zero-based index of the current retry attempt.
   * @returns {boolean} - A value indicating whether a retry attempt should occur.
   *                      Returning true suggests a retry is warranted; false indicates no more retries should be made.
   */
  shouldRetry(attempt: number): boolean;

  /**
   * Calculates the delay that should be observed before the next retry attempt.
   *
   * @param {number} attempt - The zero-based index of the current retry attempt.
   * @returns {number} - The delay in milliseconds before the next attempt should be initiated.
   */
  getDelayMs(attempt: number): number;

  /**
   * Retrieves the maximum number of retry attempts defined in the strategy.
   *
   * This method should return the upper limit on the number of retries that
   * the strategy will permit. Once this limit is reached, no further retry
   * should be attempted, and the error should be handled or propagated.
   *
   * @returns {number} - The maximum number of attempts that will be allowed by the retry strategy.
   */
  get maxAttempts(): number;
}

/**
 * Enumeration of possible retry strategy types.
 */
export enum RetryStrategyType {
  /**
   * Indicates no retry strategy, meaning that no retries should be performed.
   */
  NoRetry = 'no-retry',

  /**
   * Indicates a retry strategy that occurs at fixed intervals.
   */
  Interval = 'interval',

  /**
   * Indicates a retry strategy that uses an exponential backoff algorithm for delaying retries.
   */
  Exponential = 'exponential',

  /**
   * Indicates a retry strategy that uses a polynomial backoff algorithm for delaying retries.
   */
  Polynomial = 'polynomial',
}

/**
 * Options for the interval-based retry strategy.
 */
interface IntervalRetryStrategyOptions {
  /**
   * The type of retry strategy, which is the interval in this case.
   */
  type: RetryStrategyType.Interval;

  /**
   * The maximum number of retry attempts before giving up.
   */
  maxAttempts: number;

  /**
   * The fixed interval between retries in milliseconds.
   */
  intervalMs: number;
}

/**
 * Options for the exponential backoff retry strategy.
 */
interface ExponentialBackoffRetryStrategyOptions {
  /**
   * The type of retry strategy, which is exponential in this case.
   */
  type: RetryStrategyType.Exponential;

  /**
   * The maximum number of retries to attempt.
   */
  maxAttempts: number;

  /**
   * The initial delay in milliseconds before the first retry, which doubles with each subsequent retry.
   */
  initialDelayMs: number;
}

/**
 * Options for the polynomial backoff retry strategy.
 */
interface PolynomialBackoffRetryStrategyOptions {
  /**
   * The type of retry strategy, which is exponential in this case.
   */
  type: RetryStrategyType.Polynomial;

  /**
   * The maximum number of retries to attempt.
   */
  maxAttempts: number;

  /**
   * The initial delay in milliseconds before the first retry, which doubles with each subsequent retry.
   */
  initialDelayMs: number;

  /**
   * The degree of the polynomial function to calculate the delay. Must be a positive integer.
   */
  degree: number;
}

/**
 * Options indicating that no retries should be performed.
 */
interface NoRetryStrategyOptions {
  /**
   * The type of retry strategy, which indicates no retry in this case.
   */
  type: RetryStrategyType.NoRetry;
}

/**
 * Union type combining all possible retry strategy options.
 */
export type RetryStrategyOptions =
  | IntervalRetryStrategyOptions
  | ExponentialBackoffRetryStrategyOptions
  | PolynomialBackoffRetryStrategyOptions
  | NoRetryStrategyOptions;
