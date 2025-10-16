// src/shared/auth/jwt.ts
import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";

/** Use tipos do próprio jsonwebtoken pra não brigar com TS */
const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "dev-access";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "dev-refresh";

/** Tipar expiresIn com SignOptions["expiresIn"] evita o erro de união estranha */
const ACCESS_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]) || "2m";
const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"]) || "10m";

/** Claims */
export interface BaseClaims extends JwtPayload {
  sub: string;                 // user id
  type?: "access" | "refresh";
}

export interface AccessClaims extends BaseClaims {
  email?: string;
  type: "access";
}

export interface RefreshClaims extends BaseClaims {
  jti: string;
  type: "refresh";
}

/** Assina access */
export function signAccess(claims: { sub: string; email?: string }): string {
  const payload: AccessClaims = { ...claims, type: "access" };
  const opts: SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  return jwt.sign(payload, ACCESS_SECRET, opts);
}

/** Assina refresh */
export function signRefresh(claims: { sub: string; jti: string }): string {
  const payload: RefreshClaims = { ...claims, type: "refresh" };
  const opts: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign(payload, REFRESH_SECRET, opts);
}

/** Pega exp (epoch seconds) do refresh recém-assinado */
export function decodeRefreshExp(refreshToken: string): number {
  const decoded = jwt.decode(refreshToken) as JwtPayload | null;
  if (!decoded?.exp) throw new Error("refresh token sem exp");
  return decoded.exp;
}

/** Verifica access */
export function verifyAccess(token: string): AccessClaims {
  const payload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  if (payload.type && payload.type !== "access") {
    throw new Error("invalid token type");
  }
  return payload as AccessClaims;
}

function hasJti(payload: JwtPayload): payload is JwtPayload & { jti: string } {
  return typeof (payload as JwtPayload).jti === "string";
}

/** Verifica refresh */
export function verifyRefresh(token: string): RefreshClaims {
  const payload = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  if (payload.type && payload.type !== "refresh") {
    throw new Error("invalid token type");
  }
  if (!hasJti(payload)) {
    throw new Error("missing jti in refresh token");
  }
  return payload as RefreshClaims;
}
