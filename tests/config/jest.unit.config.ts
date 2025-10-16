import type { Config } from 'jest';

const config: Config = {
  rootDir: '../..',             // <- força raiz do repo
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/tests/unit/**/*.spec.ts',
    '<rootDir>/src/**/tests/unit/**/*.test.ts'
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
