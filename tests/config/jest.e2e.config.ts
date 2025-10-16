import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/e2e/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/e2e/setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};

export default config;
