import { Request, Response, NextFunction } from "express";
import { GetMeService } from "../services/get-me.service";
import { UpdateProfileService } from "../services/update-profile.service";
import { updateProfileSchema } from "../dto/update-profile.dto";
import { AppError } from "../../../shared/errors/AppError";

export class UsersController {
  constructor(
    private readonly getMeService: GetMeService,
    private readonly updateProfileService: UpdateProfileService
  ) {}

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const user = await this.getMeService.execute(req.user.id);
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const dto = updateProfileSchema.parse(req.body);
      const updated = await this.updateProfileService.execute(req.user.id, dto);
      return res.status(200).json({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      });
    } catch (err) {
      next(err);
    }
  }
}
