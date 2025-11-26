import { createLogger, LogLevel, createFileTransport } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

describe('Logger', () => {
  describe('Basic logging', () => {
    it('should log messages with all levels', () => {
      const logs: string[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        mode: 'pretty',
        transports: [transport],
      });

      logger.trace('trace message');
      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');
      logger.fatal('fatal message');

      expect(logs).toHaveLength(6);
      expect(logs[0]).toContain('trace message');
      expect(logs[1]).toContain('debug message');
      expect(logs[2]).toContain('info message');
      expect(logs[3]).toContain('warn message');
      expect(logs[4]).toContain('error message');
      expect(logs[5]).toContain('fatal message');
    });

    it('should filter by log level', () => {
      const logs: string[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Warn,
        mode: 'pretty',
        transports: [transport],
      });

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(logs).toHaveLength(2);
      expect(logs[0]).toContain('warn');
      expect(logs[1]).toContain('error');
    });

    it('should support metadata', () => {
      const logs: any[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(entry);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        transports: [transport],
      });

      logger.info('test', { userId: 123, action: 'login' });

      expect(logs[0].meta).toEqual({ userId: 123, action: 'login' });
    });
  });

  describe('Context support', () => {
    it('should add context to child loggers', () => {
      const logs: any[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(entry);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        transports: [transport],
      });

      const authLogger = logger.withContext('AuthService');
      authLogger.info('user logged in');

      expect(logs[0].context).toBe('AuthService');
    });

    it('should show context in pretty output', () => {
      const logs: string[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        mode: 'pretty',
        transports: [transport],
      });

      const dbLogger = logger.withContext('Database');
      dbLogger.error('connection failed');

      expect(logs[0]).toContain('[Database]');
      expect(logs[0]).toContain('connection failed');
    });
  });

  describe('JSON mode', () => {
    it('should output valid JSON', () => {
      const logs: string[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        mode: 'json',
        transports: [transport],
      });

      logger.info('test message', { key: 'value' });

      const parsed = JSON.parse(logs[0]);
      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('test message');
      expect(parsed.meta.key).toBe('value');
    });
  });

  describe('Runtime configuration', () => {
    it('should allow changing log level at runtime', () => {
      const logs: string[] = [];
      const transport = (entry: any, formatted: string) => {
        logs.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Info,
        transports: [transport],
      });

      logger.debug('debug 1');
      expect(logs).toHaveLength(0);

      logger.setLevel(LogLevel.Debug);
      logger.debug('debug 2');
      expect(logs).toHaveLength(1);
    });
  });

  describe('File transport', () => {
    it('should write logs to file', () => {
      const testFile = '/tmp/test-logs.log';
      
      // Clean up if exists
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }

      const logger = createLogger({
        level: LogLevel.Trace,
        mode: 'pretty',
        transports: [createFileTransport(testFile)],
      });

      logger.info('test log entry');

      expect(fs.existsSync(testFile)).toBe(true);
      const content = fs.readFileSync(testFile, 'utf-8');
      expect(content).toContain('test log entry');

      // Clean up
      fs.unlinkSync(testFile);
    });
  });

  describe('Multiple transports', () => {
    it('should send to all transports', () => {
      const logs1: string[] = [];
      const logs2: string[] = [];

      const transport1 = (entry: any, formatted: string) => {
        logs1.push(formatted);
      };

      const transport2 = (entry: any, formatted: string) => {
        logs2.push(formatted);
      };

      const logger = createLogger({
        level: LogLevel.Trace,
        transports: [transport1, transport2],
      });

      logger.info('shared message');

      expect(logs1).toHaveLength(1);
      expect(logs2).toHaveLength(1);
      expect(logs1[0]).toContain('shared message');
      expect(logs2[0]).toContain('shared message');
    });
  });
});
