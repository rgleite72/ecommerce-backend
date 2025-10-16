import { Request, Response, NextFunction } from "express";
import { ListUsersService } from "../services/list-users.service";
import { GetUserByIdService } from "../services/get-user-by-id.service";
import { CreateUserService } from "../services/create-user.service";
import { UpdateUserService } from "../services/update-user.service";
import { DeleteUserService } from "../services/delete-user.service";
import { createUserSchema } from "../dto/create-user.dto";
import { updateUserSchema, UpdateUserDTO } from "../dto/update-user.dto";

export class UsersAdminController {
  constructor(
    private readonly listUsersService: ListUsersService,
    private readonly getUserByIdService: GetUserByIdService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService
  ) {}

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 20);

            // normaliza o query param (pode chegar como string ou array)
            const raw = req.query.search;
            const norm = Array.isArray(raw) ? raw.join(" ").trim() : raw?.toString().trim();
            const search = norm ? norm : undefined;

            const result = await this.listUsersService.execute({ page, limit, q: search });

            const data = result.data.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            }));

            return res
            .status(200)
            .json({ data, page: result.page, limit: result.limit, total: result.total });
        } catch (err) {
            next(err);
        }
    }



  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.getUserByIdService.execute(req.params.id);
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createUserSchema.parse(req.body);
      const created = await this.createUserService.execute(dto);
      return res.status(201).json({
        id: created.id,
        email: created.email,
        name: created.name,
        role: created.role,
      });
    } catch (err) {
      next(err);
    }
  }

async update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const dto: UpdateUserDTO = updateUserSchema.parse(req.body); // parse já tipa
    const updated = await this.updateUserService.execute(id, dto);

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
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteUserService.execute(req.params.id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
