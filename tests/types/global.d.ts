import type { Express } from "express";

declare global {
  // Variável global para os testes E2E
  var testApp: Express;
  var loginAs: (email: string, password: string) => Promise<{ accessToken: string; refreshToken?: string }>;
}

export {};




