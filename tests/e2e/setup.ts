// tests/e2e/setup.ts
import { initTestDB, closeTestDB } from "./helpers/db";
import { createApp } from "../../src/app/app";
import { loginAs } from "./helpers/auth";
import type { Express } from "express";

declare global {

  var testApp: Express | undefined;

  var loginAs: (email: string, password: string) => Promise<{ accessToken: string; refreshToken?: string }>;
}

const app = createApp();
globalThis.testApp = app;
globalThis.loginAs = (email, password) => loginAs(globalThis.testApp!, email, password);

beforeAll(async () => {
  await initTestDB();
});

afterAll(async () => {
  await closeTestDB();
});
