import "express";
import type { Logger } from "pino"; // se estiver usando pino

export type Role = "admin" | "user";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user: User;
      requestId?: string;    
      log?: Logger;          
    }
  }
}
