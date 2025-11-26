import {
  LogLevel,
  logLevelRanks,
  LogEntry,
  Transport,
  LoggerConfig,
  ILogger,
} from './types';
import { formatPretty, formatJSON, defaultConsoleTransport } from './formatters';

/**
 * Logger implementation
 */
class Logger implements ILogger {
  private level: LogLevel;
  private mode: 'pretty' | 'json';
  private context?: string;
  private transports: Transport[];

  constructor(config: LoggerConfig = {}) {
    this.level = config.level || LogLevel.Info;
    this.context = config.context;

    // Determine mode based on NODE_ENV if not explicitly set
    if (config.mode) {
      this.mode = config.mode;
    } else {
      this.mode = process.env.NODE_ENV === 'production' ? 'json' : 'pretty';
    }

    // Use provided transports or default to console
    this.transports = config.transports || [defaultConsoleTransport];
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    // Check if this level should be logged
    if (logLevelRanks[level] < logLevelRanks[this.level]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      meta,
    };

    const formatter = this.mode === 'json' ? formatJSON : formatPretty;
    const formatted = formatter(entry);

    // Send to all transports
    for (const transport of this.transports) {
      try {
        transport(entry, formatted);
      } catch (error) {
        // Prevent transport errors from breaking logging
        console.error('Transport error:', error);
      }
    }
  }

  trace(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Trace, message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Debug, message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Info, message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Warn, message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Error, message, meta);
  }

  fatal(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.Fatal, message, meta);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  withContext(context: string): ILogger {
    return new Logger({
      level: this.level,
      mode: this.mode,
      context,
      transports: this.transports,
    });
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(config?: LoggerConfig): ILogger {
  return new Logger(config);
}
