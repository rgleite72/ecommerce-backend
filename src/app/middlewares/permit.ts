// src/app/middlewares/permit.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db/data-source";
import { UserEntity } from "../../modules/users/domain/entities/user.entity";

export function permit(permissionCode: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // ⚠️ NADA de bypass pra admin aqui; sempre consultar o DB
    const user = req.user as UserEntity | undefined;
    if (!user) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    // Verifica exatamente (role, permission_code)
    const rows = await AppDataSource.query(
      `SELECT 1
         FROM role_permissions
        WHERE role = $1
          AND permission_code = $2
        LIMIT 1`,
      [user.role, permissionCode] // <-- "users.read" (ponto)
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }

    return next();
  };
}
