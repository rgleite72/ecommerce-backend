import { Router } from "express";
import { buildAuthRouter } from "../modules/auth/routes";
import { SessionController } from "../modules/auth/controllers/session.controller";
import { rateLimitLogin } from "../app/middlewares/rate-limit-login";
import { config } from "../config";

import usersRouter from "../modules/users/routes";
import adminUsersRouter from "../modules/users/admin.routes";
import customersRouter from "../modules/customers/routes";
import addressRouter from "../modules/address/routes";

export const router = Router();

// Composition root: instancia controller e injeta policy via config
const sessionController = new SessionController();

router.use(
  "/auth",
  buildAuthRouter({
    controller: sessionController,
    rateLimit: config.security.authRateLimitEnabled ? rateLimitLogin : null,
  })
);

router.use("/users", usersRouter);
router.use("/admin/users", adminUsersRouter);
router.use("/customers", customersRouter);
router.use("/address", addressRouter);

router.get("/health", (_req, res) => res.json({ status: "ok" }));
