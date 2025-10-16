// src/config/index.ts
const isTest = process.env.NODE_ENV === "test";
const disableRate = process.env.DISABLE_RATE_LIMIT === "true";

export const config = {
  env: process.env.NODE_ENV ?? "development",
  security: {
    globalRateLimitEnabled: !isTest && !disableRate,
    authRateLimitEnabled:   !isTest && !disableRate,
  },
} as const;
