import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpRetryStrategiesService } from './http-retry-strategies.service';
import {
  RetryStrategy,
  RetryStrategyOptions,
  RetryStrategyType,
} from './http-retry-strategies.interface';
import { ExponentialBackoffRetryStrategy } from './strategies/exponential-backoff-retry';
import { ConstantIntervalRetryStrategy } from './strategies/constant-interval-retry';
import { NoRetryStrategy } from './strategies/no-retry';
import { PolynomialBackoffRetryStrategy } from './strategies';
import { FibonacciBackoffRetryStrategy } from './strategies/fibonacci-backoff-retry';

/**
 * The HttpRetryStrategiesModule is responsible for providing a configurable
 * retry strategy for HTTP requests. It dynamically registers the appropriate
 * retry strategy based on the provided RetryStrategyOptions.
 */
@Global()
@Module({})
export class HttpRetryStrategiesModule {
  /**
   * Registers a dynamic provider for the HTTP_RETRY_STRATEGY token based on the provided options.
   * @param {RetryStrategyOptions} options - The configuration for the retry strategy.
   * @returns {DynamicModule} - The configured module with the dynamic provider.
   */
  static register(options: RetryStrategyOptions): DynamicModule {
    const strategyProvider: Provider = {
      provide: 'HTTP_RETRY_STRATEGY',
      useFactory: (): RetryStrategy => {
        switch (options.type) {
          case RetryStrategyType.Exponential:
            return new ExponentialBackoffRetryStrategy(
              options.maxAttempts,
              options.initialDelayMs,
            );
          case RetryStrategyType.Interval:
            return new ConstantIntervalRetryStrategy(
              options.maxAttempts,
              options.intervalMs,
            );
          case RetryStrategyType.Polynomial:
            return new PolynomialBackoffRetryStrategy(
              options.maxAttempts,
              options.initialDelayMs,
              options.degree,
            );
          case RetryStrategyType.Fibonacci:
            return new FibonacciBackoffRetryStrategy(
              options.maxAttempts,
              options.initialDelayMs,
            );
          default:
            return new NoRetryStrategy();
        }
      },
    };

    return {
      module: HttpRetryStrategiesModule,
      imports: [HttpModule],
      providers: [HttpRetryStrategiesService, strategyProvider],
      exports: [HttpRetryStrategiesService, HttpModule],
    };
  }
}
