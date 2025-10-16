import { Router, type RequestHandler } from "express";
import { SessionController } from "./controllers/session.controller";

type BuildAuthRouterOpts = {
  controller: SessionController;     // injeção explícita, sem interface de domínio aqui
  rateLimit?: RequestHandler | null; // política opcional
};

export function buildAuthRouter({ controller, rateLimit }: BuildAuthRouterOpts) {
  const router = Router();

  // Aplica policy uma única vez no subrouter, sem espalhar por rota
  if (rateLimit) {
    router.use(rateLimit);
  }

  router.post("/login",      (req, res, next) => controller.login(req, res, next));
  router.post("/refresh",    (req, res, next) => controller.refresh(req, res, next));
  router.post("/logout",     (req, res, next) => controller.logout(req, res, next));
  router.post("/logout-all", (req, res, next) => controller.logoutAll(req, res, next));

  return router;
}
