/* eslint-env node */
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/tests/e2e/"],
  clearMocks: true,
  verbose: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/index.ts",
    "!src/**/routes.ts",
    "!**/*.d.ts"
  ],
  globals: { "ts-jest": { tsconfig: "<rootDir>/tsconfig.json" } }
};
