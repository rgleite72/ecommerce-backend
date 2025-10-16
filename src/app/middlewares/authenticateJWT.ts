import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../../shared/auth/jwt";
import { AppDataSource } from "../../app/db/data-source";
import { UserEntity } from "../../modules/users/domain/entities/user.entity";

interface AuthInfo {
  userId: string;
  email: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthInfo;
    userId?: string;
    user?: UserEntity;
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  // 1) entrou no middleware
 
  console.log("AUTH◽", req.method, req.path);

  const auth = req.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) {

    console.log("AUTH◽ no bearer");
    return res.status(401).json({ error: { message: "Missing Bearer token" } });
  }

  try {
    const token = m[1];
    // 2) temos bearer; verifique o token
    const payload = verifyAccess(token) as { sub: string; email?: string; type?: string };

  
    console.log("AUTH◽ payload:", { sub: payload.sub, email: payload.email, type: payload.type });

    if (payload.type && payload.type !== "access") {
  
      console.log("AUTH◽ invalid type:", payload.type);
      return res.status(401).json({ error: { message: "Invalid token type" } });
    }

    const repo = AppDataSource.getRepository(UserEntity);
    const user = await repo.findOne({ where: { id: payload.sub } });

    if (!user) {
   
      console.log("AUTH◽ user not found for sub", payload.sub);
      return res.status(401).json({ error: { message: "User not found" } });
    }

   
    console.log("AUTH◽ user OK:", { id: user.id, email: user.email, role: user.role });

    req.auth = { userId: user.id, email: user.email, role: user.role };
    req.userId = user.id;
    req.user = user;

   
    console.log("AUTH◽ next()");
    return next();
  } catch (e) {
   
    console.log("AUTH◽ verifyAccess error:", (e as Error).message);
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
}
