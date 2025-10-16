// src/app/middlewares/security.ts
import helmet from "helmet";
import cors from "cors";
import hpp from 'hpp'
import express from "express";
import type { RequestHandler } from "express";
import { env } from "../../shared/utils/env";

const ALLOWED_ORIGINS = env.CORS_ORIGIN_LIST; // vem validado do Zod

export const securityMiddlewares: RequestHandler[] = [
  helmet({
    // API JSON — sem CSP complexo por enquanto
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
    // usa a flag do env (em prod você pode ligar/desligar conforme infra)
    hsts: env.HSTS_ENABLED ? undefined : false,
  }),

  cors({
    origin(origin, cb) {
      const allow =
        !origin ||              // chamadas server-to-server
        ALLOWED_ORIGINS.length === 0 || 
        ALLOWED_ORIGINS.includes(origin);

      return allow ? cb(null, true) : cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),

  // Mitiga HTTP Parameter Pollution (querystring)
  hpp(),

  // Body parser com limite vindo do env
  express.json({ limit: env.REQUEST_BODY_LIMIT }),
  // Se precisar futuramente:
  // express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }),
];
