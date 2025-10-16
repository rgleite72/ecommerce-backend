import rateLimit from "express-rate-limit";
import { env } from "../../shared/utils/env";
import { Request, Response, NextFunction } from "express";

export const rateLimitLogin = env.RATE_LIMIT_LOGIN_ENABLED
  ? rateLimit({
      windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS, // ex.: 1 * 60 * 1000
      max: env.RATE_LIMIT_AUTH_MAX,            // ex.: 5
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { message: "Too many login attempts. Try again later." } },
    })
  : (_req: Request, _res: Response, next: NextFunction) => next();
