# @yambwa/pretty-logger

A lightweight, extensible logger with log levels, pretty and JSON output, context support, and pluggable transports for Node.js and TypeScript projects.

## Features

- **Multiple log levels**: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- **Two output modes**: Pretty (colored for development) and JSON (for production)
- **Pluggable transports**: Send logs to console, files, APIs, or custom destinations
- **Context support**: Identify which part of your app logs are coming from
- **TypeScript support**: Full type definitions included
- **Lightweight**: Minimal dependencies, easy to integrate

## Installation

```bash
npm install @yambwa/pretty-logger
```

## Quick Start

```ts
import { createLogger } from '@yambwa/pretty-logger';

const logger = createLogger();

logger.info('Application started', { port: 3000 });
logger.warn('Low memory', { available: '256MB' });
logger.error('Database error', { code: 'DB001' });
```

## Configuration

### Basic Configuration

```ts
import { createLogger, LogLevel } from '@yambwa/pretty-logger';

const logger = createLogger({
  level: LogLevel.Debug,        // Minimum log level
  mode: 'pretty',               // 'pretty' or 'json'
  context: 'AppInit',           // Optional context tag
  transports: [                 // Custom transports
    (entry, formatted) => console.log(formatted),
  ],
});
```

### Auto Mode Selection

By default, the logger chooses the mode based on `NODE_ENV`:

- `NODE_ENV=development` → `pretty` mode (colored output)
- `NODE_ENV=production` → `json` mode (structured output)

## Logging Methods

All methods accept a message and optional metadata object:

```ts
logger.trace('Detailed trace info', { var: 'value' });
logger.debug('Debug message', { userId: 123 });
logger.info('Information', { action: 'login' });
logger.warn('Warning message', { deprecated: true });
logger.error('Error occurred', { code: 'E001' });
logger.fatal('Critical error', { shutdown: true });
```

## Pretty Mode Output

```
2025-11-26T20:15:32.123Z INFO  Application started {"port":3000}
2025-11-26T20:15:33.456Z WARN  [AuthService] Invalid login attempt {"userId":123}
2025-11-26T20:15:34.789Z ERROR [Database] Connection failed {"retries":3}
```

Output is color-coded with ANSI colors for easy terminal reading.

## JSON Mode Output

```json
{"level":"info","message":"Application started","timestamp":"2025-11-26T20:15:32.123Z","meta":{"port":3000}}
{"level":"warn","message":"Invalid login attempt","timestamp":"2025-11-26T20:15:33.456Z","context":"AuthService","meta":{"userId":123}}
{"level":"error","message":"Connection failed","timestamp":"2025-11-26T20:15:34.789Z","context":"Database","meta":{"retries":3}}
```

Each line is a valid JSON object, perfect for log aggregation services.

## Context Support

Create child loggers with a fixed context to identify where logs come from:

```ts
const logger = createLogger();

const authLogger = logger.withContext('AuthService');
const dbLogger = logger.withContext('Database');
const apiLogger = logger.withContext('API');

authLogger.info('User authenticated', { userId: 42 });
dbLogger.error('Query failed', { query: 'SELECT ...' });
apiLogger.warn('Rate limit approaching', { requests: 95 });
```

## Transports

### Using the File Transport

```ts
import { createLogger, createFileTransport } from '@yambwa/pretty-logger';

const logger = createLogger({
  transports: [
    // Console
    (entry, formatted) => console.log(formatted),
    // File
    createFileTransport('logs/app.log'),
  ],
});
```

### Creating Custom Transports

A transport is any function that receives a `LogEntry` and formatted string:

```ts
const customTransport = (entry, formatted) => {
  // Send to external service
  fetch('https://logs.example.com/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
};

const logger = createLogger({
  transports: [customTransport],
});
```

## Runtime Configuration

Change the log level at runtime:

```ts
const logger = createLogger({ level: LogLevel.Info });

logger.info('This is logged');
logger.debug('This is not logged');

logger.setLevel(LogLevel.Debug);
logger.debug('Now this is logged');
```

## API Reference

### `createLogger(config?: LoggerConfig)`

Creates a new logger instance.

**Parameters:**
- `config.level` (LogLevel): Minimum level to log (default: `Info`)
- `config.mode` ('pretty' | 'json'): Output format (default: auto-detect from NODE_ENV)
- `config.context` (string): Optional context tag
- `config.transports` (Transport[]): Array of transport functions

**Returns:** `ILogger`

### `createFileTransport(filePath: string)`

Creates a file transport that appends logs to a file.

**Parameters:**
- `filePath` (string): Path to log file

**Returns:** `Transport`

### Logger Methods

All logging methods have the signature:
```ts
method(message: string, meta?: Record<string, any>): void
```

- `logger.trace(message, meta?)`
- `logger.debug(message, meta?)`
- `logger.info(message, meta?)`
- `logger.warn(message, meta?)`
- `logger.error(message, meta?)`
- `logger.fatal(message, meta?)`
- `logger.setLevel(level)`
- `logger.withContext(context)`

## License

MIT
