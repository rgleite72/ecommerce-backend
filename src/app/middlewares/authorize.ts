import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import type { Role } from "../../types";


export function authorize(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    if (allowed.length > 0 && !allowed.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    return next();
  };
}
