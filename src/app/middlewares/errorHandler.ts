// src/app/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import logger from "../../shared/logger";
import { AppError } from "../../shared/errors/AppError";

const isProd = process.env.NODE_ENV === "production";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Normaliza para Error
  const error = err instanceof Error ? err : new Error(String(err));
  const requestId = req.requestId; // garante compat com seu middleware de requestId
  const log = req.log ?? logger;   // pino-http ou logger fallback

  // AppError conhecido → respeita statusCode e message
  if (error instanceof AppError) {
    // 4xx costuma ser warn; inclui details no log quando houver
    log.warn(
      {
        requestId,
        err: {
          name: error.name,
          message: error.message,
          code: error.code ?? "APP_ERROR",
          details: error.details, // <- novo
        },
      },
      "Handled AppError"
    );

    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code ?? "APP_ERROR",
        details: error.details, // <- novo
        requestId,
      },
    });
  }

  // Desconhecido → 500 (log completo em dev)
  log.error(
    {
      requestId,
      err: {
        name: error.name,
        message: error.message,
        stack: isProd ? undefined : error.stack,
      },
    },
    "Unhandled error"
  );

  return res.status(500).json({
    error: {
      message: isProd ? "Internal server error" : error.message,
      code: "INTERNAL_SERVER_ERROR",
      requestId,
    },
  });
}
