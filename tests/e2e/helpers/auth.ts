// tests/e2e/helpers/auth.ts
import request from "supertest";
import type { Express } from "express";

export async function loginAs(app: Express, email = "admin@acme.com", password = "Admin#123") {
  const r = await request(app)
    .post("/api/auth/login")
    .send({ email, password });
  if (![200, 201].includes(r.status)) {
    throw new Error(`Login failed: HTTP ${r.status} - ${JSON.stringify(r.body)}`);
  }
  return {
    accessToken: r.body.accessToken ?? r.body.token,
    refreshToken: r.body.refreshToken,
  };
}
