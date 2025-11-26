/**
 * Log levels supported by the logger
 */
export enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

/**
 * Numeric representation of log levels for comparison
 */
export const logLevelRanks: Record<LogLevel, number> = {
  [LogLevel.Trace]: 0,
  [LogLevel.Debug]: 1,
  [LogLevel.Info]: 2,
  [LogLevel.Warn]: 3,
  [LogLevel.Error]: 4,
  [LogLevel.Fatal]: 5,
};

/**
 * Raw log entry object passed to transports
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  meta?: Record<string, any>;
}

/**
 * A transport function that receives a log entry and formatted string
 */
export type Transport = (entry: LogEntry, formatted: string) => void | Promise<void>;

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  level?: LogLevel;
  mode?: 'pretty' | 'json';
  context?: string;
  transports?: Transport[];
}

/**
 * Logger interface
 */
export interface ILogger {
  trace(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  fatal(message: string, meta?: Record<string, any>): void;
  setLevel(level: LogLevel): void;
  withContext(context: string): ILogger;
}
