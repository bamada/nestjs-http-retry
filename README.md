<p align="center">
  <a href="https://github.com/your-github/nestjs-http-retry" target="blank"><img src="https://test.todo" width="120" alt="NestJS HTTP Retry Module Logo" /></a>
</p>

<p align="center">A resilient <a href="http://nestjs.com/" target="blank">NestJS</a> module to handle HTTP requests with configurable retry strategies.</p>

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Examples](#examples)
- [Contribute & Disclaimer](#contribute--disclaimer)
- [License](#license)
- [Contributors](#contributors-)

---

## Description

This module integrates an HTTP retry functionality into the NestJS framework, providing configurable retry strategies like Exponential Backoff or Constant Interval retries.

## Features

The NestJS HTTP Retry module supports these key features:

- Easy-to-use configurable retry strategies
- Exponential Backoff retries
- Constant Interval retries
- No-retry option

---

## Installation

You can install the module using yarn or npm:

```bash
$ yarn add @bamada/nestjs-http-retry
```

OR

```bash
$ npm i @bamada/nestjs-http-retry
```

## Configuration

To configure the retry strategies, pass the desired settings when registering the module:

```typescript
import {
  HttpRetryStrategiesModule,
  RetryStrategyType,
} from '@bamada/nestjs-http-retry';

@Module({
  imports: [
    HttpRetryStrategiesModule.register({
      type: RetryStrategyType.Interval,
      maxAttempts: 3,
      intervalMs: 1000,
    }),
  ],
  // Other module properties
})
export class AppModule {}
```

## Usage

Once configured, use the `HttpRetryStrategiesService` to make HTTP requests with the built-in retry strategies.

## Examples

Below is a simple example of how to use the HTTP Retry Strategies service:

```typescript
import { Injectable } from '@nestjs/common';
import { HttpRetryStrategiesService } from '@bamada/nestjs-http-retry';

@Injectable()
export class YourService {
  constructor(private readonly httpRetryService: HttpRetryStrategiesService) {}

  async getResource() {
    return this.httpRetryService.get('https://your.api/resource').toPromise();
  }
}
```

## Contribute & Disclaimer

Feel free to contribute by submitting pull requests or opening issues. This module comes with no warranty; use it at your own risk.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bamada"><img src="https://avatars.githubusercontent.com/u/7466570?v=4?s=100" width="100px;" alt="madcam"/><br /><sub><b>madcam</b></sub></a><br /><a href="https://github.com/bamada/nest-slack-bolt/commits?author=bamada" title="Tests">⚠️</a> <a href="https://github.com/bamada/nest-slack-bolt/commits?author=bamada" title="Code">💻</a> <a href="https://github.com/bamada/nest-slack-bolt/commits?author=bamada" title="Documentation">📖</a> <a href="https://github.com/bamada/nest-slack-bolt/issues?q=author%3Abamada" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
