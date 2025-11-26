import { LogLevel, LogEntry, Transport } from './types';

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  trace: '\x1b[36m', // cyan
  debug: '\x1b[35m', // magenta
  info: '\x1b[32m', // green
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  fatal: '\x1b[41m', // red background
};

/**
 * Format a log entry in "pretty" mode (human-friendly, colored for development)
 */
export function formatPretty(entry: LogEntry): string {
  const { level, message, timestamp, context, meta } = entry;
  const color = colors[level as keyof typeof colors] || colors.reset;
  const levelStr = level.toUpperCase().padEnd(5);
  const timeStr = timestamp.toISOString();
  const contextStr = context ? ` [${context}]` : '';
  const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

  return `${color}${timeStr} ${levelStr}${colors.reset}${contextStr} ${message}${metaStr}`;
}

/**
 * Format a log entry in "json" mode (structured for production/log collectors)
 */
export function formatJSON(entry: LogEntry): string {
  const output: Record<string, any> = {
    level: entry.level,
    message: entry.message,
    timestamp: entry.timestamp.toISOString(),
  };

  if (entry.context) {
    output.context = entry.context;
  }

  if (entry.meta && Object.keys(entry.meta).length > 0) {
    output.meta = entry.meta;
  }

  return JSON.stringify(output);
}

/**
 * Default console transport - logs to stdout
 */
export const defaultConsoleTransport: Transport = (entry: LogEntry, formatted: string) => {
  if (entry.level === LogLevel.Error || entry.level === LogLevel.Fatal) {
    console.error(formatted);
  } else {
    console.log(formatted);
  }
};
