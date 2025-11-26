import * as fs from 'fs';
import * as path from 'path';
import { LogEntry, Transport } from './types';

/**
 * Create a file transport that appends logs to a file
 */
export function createFileTransport(filePath: string): Transport {
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return (entry: LogEntry, formatted: string) => {
    try {
      fs.appendFileSync(filePath, formatted + '\n', 'utf-8');
    } catch (error) {
      console.error(`Failed to write log to file ${filePath}:`, error);
    }
  };
}
