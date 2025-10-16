import { Response, Request, NextFunction } from "express";
import { LoginService } from "../services/login.service";
import { RefreshService } from "../services/refresh.service";
import { AppError } from "../../../shared/errors/AppError";
import { refreshSchema } from "../dto/refresh.dto";
import { createSessionSchema } from "../dto/create-session.dto";
import { logoutSchema } from "../dto/logout.dto";
import { logoutAllSchema } from "../dto/logout-all.dto";

const loginService = new LoginService()
const refreshService = new RefreshService()

export class SessionController {

    async login(req: Request, res: Response, next: NextFunction){

        try{
            const parse = createSessionSchema.safeParse(req.body)

            if(!parse.success) {
                const issues = parse.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
                throw new AppError(`Validation Error: ${issues.join(', ')}`, 422) 
            }

            const result = await loginService.execute(parse.data)
            return res.status(200).json(result)

        } catch (err) { next(err)}

    }

    async refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const parse = refreshSchema.safeParse(req.body);

        if (!parse.success) {
        const issues = parse.error.issues.map(i => `${i.path.join(".")}: ${i.message}`);
        throw new AppError(`Validation Error: ${issues.join(", ")}`, 422);
        }

        const result = await refreshService.execute(parse.data);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
    }


  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const parse = logoutSchema.safeParse(req.body);
      if (!parse.success) {
        const issues = parse.error.issues.map(i => `${i.path.join(".")}: ${i.message}`);
        throw new AppError(`Validation Error: ${issues.join(", ")}`, 422);
      }

      await refreshService.revokeOne(parse.data.refreshToken);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parse = logoutAllSchema.safeParse(req.body);
      if (!parse.success) {
        const issues = parse.error.issues.map(i => `${i.path.join(".")}: ${i.message}`);
        throw new AppError(`Validation Error: ${issues.join(", ")}`, 422);
      }

      await refreshService.revokeAll(parse.data.userId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

}

