/**
 * Smoke test - verify the package can be imported and used
 */
import { createLogger, LogLevel, createFileTransport } from './dist/index';

console.log('🧪 Running smoke test...\n');

// Test 1: Basic logging
console.log('Test 1: Basic logging in pretty mode');
const logger = createLogger({
  level: LogLevel.Debug,
  mode: 'pretty',
});

logger.info('Application started', { port: 3000 });
logger.debug('Debug info', { userId: 123 });

// Test 2: Context support
console.log('\nTest 2: Context support');
const authLogger = logger.withContext('AuthService');
authLogger.warn('Suspicious login attempt', { ip: '192.168.1.1' });

// Test 3: JSON mode
console.log('\nTest 3: JSON mode output');
const jsonLogger = createLogger({
  level: LogLevel.Trace,
  mode: 'json',
  transports: [(entry, formatted) => console.log(formatted)],
});

jsonLogger.info('JSON test', { data: 'structured' });

// Test 4: Runtime level change
console.log('\nTest 4: Runtime log level change');
const dynamicLogger = createLogger({
  level: LogLevel.Warn,
  mode: 'pretty',
});

console.log('With Warn level:');
dynamicLogger.debug('This should not appear');
dynamicLogger.warn('This should appear');

console.log('\nAfter changing to Debug level:');
dynamicLogger.setLevel(LogLevel.Debug);
dynamicLogger.debug('Now this appears');

// Test 5: Custom transport
console.log('\nTest 5: Custom transport');
const customLogs: string[] = [];
const customLogger = createLogger({
  transports: [(entry, formatted) => {
    customLogs.push(formatted);
    console.log(`[CUSTOM] ${formatted}`);
  }],
});

customLogger.info('Custom transport test');
console.log(`Captured ${customLogs.length} log(s) in custom transport`);

console.log('\n✅ All smoke tests passed!\n');
