// src/app/app.ts
import express from "express";
import { requestId } from "./middlewares/requestId";
import { loggerHttp } from "./middlewares/logger-http";
import { rateLimitGlobal } from "./middlewares/rate-limit-global";
import { securityMiddlewares } from "./middlewares/security";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "../routes";

const isTest = process.env.NODE_ENV === "test";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestId);

  if (!isTest) {
    app.use(loggerHttp());
    app.use(rateLimitGlobal);
  }

  app.use(securityMiddlewares);

  app.use("/api", router);
  app.use(errorHandler);

  return app;
}
