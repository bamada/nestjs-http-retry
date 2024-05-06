import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, retry, throwError, timer } from 'rxjs';
import { RetryStrategy } from './http-retry-strategies.interface';
import { AxiosRequestConfig, AxiosError } from 'axios';

@Injectable()
export class HttpRetryStrategiesService {
  logger = new Logger(HttpRetryStrategiesService.name);

  constructor(
    private httpService: HttpService,
    @Inject('HTTP_RETRY_STRATEGY')
    private retryStrategy: RetryStrategy,
  ) {}

  public get<T>(
    url: string,
    config?: AxiosRequestConfig,
    strategy?: RetryStrategy,
  ) {
    const stg = strategy || this.retryStrategy;
    return this.httpService.get<T>(url, config).pipe(
      retry({
        delay: (error: AxiosError, count) => {
          if (!stg.shouldRetry(count - 1)) {
            throw error;
          }
          this.logAttempt(url, count);
          return timer(stg.getDelayMs(count));
        },
      }),
      catchError((error: any) => {
        this.logger.error(
          `HTTP call to ${url} failed after ${stg.maxAttempts} attempts: ${error.message}`,
        );

        return throwError(
          () =>
            new Error(
              `HTTP call failed after ${stg.maxAttempts} attempts; last error message: ${error.message}`,
            ),
        );
      }),
    );
  }

  post<T, R>(url: string, data: T) {
    // return this.httpService.post<R>(url, data).pipe(
    //   retry(this.axiosRetryOptions.maxRetryAttempts),
    //   catchError((error: AxiosError) =>
    //     throwError(() => new Error(error.message)),
    //   ),
    // );
  }

  put<T, R>(url: string, data: T) {
    // return this.httpService.put<R>(url, data).pipe(
    //   retry(this.axiosRetryOptions.maxRetryAttempts),
    //   catchError((error: AxiosError) =>
    //     throwError(() => new Error(error.message)),
    //   ),
    // );
  }

  delete<R>(url: string) {
    // return this.httpService.delete<R>(url).pipe(
    //   retry(this.axiosRetryOptions.maxRetryAttempts),
    //   catchError((error: AxiosError) =>
    //     throwError(() => new Error(error.message)),
    //   ),
    // );
  }

  /**
   * A structured logging method to log the details of the HTTP attempt.
   */
  private logAttempt(url: string, count: number) {
    this.logger.log(`Attempt ${count} to call ${url} initializing.`);
  }
}
