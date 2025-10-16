import type { Config } from 'jest';

const config: Config = {
  rootDir: '../..',             // <- força raiz do repo
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/tests/e2e/**/*.spec.ts',
    '<rootDir>/src/**/tests/e2e/**/*.test.ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFiles: ['dotenv/config'],
  clearMocks: true,
  verbose: true,
};

export default config;
