// src/app/utils/env.ts
import { config } from "dotenv";
import { z } from "zod";

config();

// Aceita "15m", "7d", "30s", "900" (como número = segundos)
type JwtExpires = `${number}${"ms" | "s" | "m" | "h" | "d"}` | number;

const ExpiresSchema = z.union([
  z.coerce.number().int().positive(),     // 900 (segundos)
  z.string().regex(/^\d+(ms|s|m|h|d)$/),  // "15m", "7d", "30s", etc.
]);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Server
  PORT: z.coerce.number().default(3000),
  REQUEST_BODY_LIMIT: z.string().default("1mb"),

  // DB (alinhado ao .env)
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  // Auth (modelo com dois segredos)
  // Se você NÃO for usar JWT_SECRET único, remova-o do .env e deixe opcional aqui.
  JWT_SECRET: z.string().min(20).optional(), // legado/opcional

  JWT_ACCESS_SECRET: z.string().min(20, "JWT_ACCESS_SECRET muito curto (>=20)"),
  JWT_REFRESH_SECRET: z.string().min(20, "JWT_REFRESH_SECRET muito curto (>=20)"),
  JWT_ACCESS_EXPIRES: ExpiresSchema.default("15m"),
  JWT_REFRESH_EXPIRES: ExpiresSchema.default("7d"),

  // Segurança
  CORS_ORIGINS: z.string().optional(), // "http://localhost:3000,https://meudominio.com"
  HSTS_ENABLED: z.coerce.boolean().default(false),

  // Rate limit (apenas login)
  RATE_LIMIT_LOGIN_ENABLED: z.coerce.boolean().default(true),
  RATE_LIMIT_AUTH_WINDOW_MIN: z.coerce.number().default(10),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(20),

  // Crypto
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  // AWS básico (MVP) – deixe opcional por enquanto
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const d = parsed.data;

export const env: Omit<typeof d, "JWT_ACCESS_EXPIRES" | "JWT_REFRESH_EXPIRES"> & {
  JWT_ACCESS_EXPIRES: JwtExpires;
  JWT_REFRESH_EXPIRES: JwtExpires;
  RATE_LIMIT_AUTH_WINDOW_MS: number;
  CORS_ORIGIN_LIST: string[];
} = {
  ...d,
  JWT_ACCESS_EXPIRES: d.JWT_ACCESS_EXPIRES as JwtExpires,
  JWT_REFRESH_EXPIRES: d.JWT_REFRESH_EXPIRES as JwtExpires,
  RATE_LIMIT_AUTH_WINDOW_MS: d.RATE_LIMIT_AUTH_WINDOW_MIN * 60 * 1000,
  CORS_ORIGIN_LIST: (d.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
}
