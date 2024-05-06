import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpRetryStrategiesService } from './http-retry-strategies.service';
import {
  RetryStrategy,
  RetryStrategyOptions,
  RetryStrategyType,
} from './http-retry-strategies.interface';
import { ExponentialBackoffRetryStrategy } from 'src/strategies/exponential-backoff-retry.strategy';
import { ConstantIntervalRetryStrategy } from 'src/strategies/constant-interval-retry.strategy';
import { NoRetryStrategy } from 'src/strategies/no-retry-strategy';

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
