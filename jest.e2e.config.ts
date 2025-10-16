import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'],
  verbose: true,
  maxWorkers: 1,       // e2e geralmente sequencial
  forceExit: true,
  detectOpenHandles: true,
};

export default config;
