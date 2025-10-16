// types/express.d.ts  (ou onde já está o seu express.d.ts)
import "express";
import type { Logger } from "pino";

// ⬇️ importe o tipo do seu usuário para tipar o currentUser
import type { UserEntity } from "../src/modules/users/domain/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      log?: Logger;

      // ⬇️ novos campos usados pelos middlewares de auth/RBAC
      auth?: { userId: string; email: string; role: "user" | "admin" };
      userId?: string;
      currentUser?: UserEntity; // não conflita com Request.user do passport
    }
  }
}
