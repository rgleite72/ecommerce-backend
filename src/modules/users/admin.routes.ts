import { Router } from "express";
import { authenticateJWT } from "../../app/middlewares/authenticateJWT";
import { authorize } from "../../app/middlewares/authorize";
import { permit } from "../../app/middlewares/permit";

import { UsersAdminController } from "./controllers/users.admin.controller";
import { ListUsersService } from "./services/list-users.service";
import { GetUserByIdService } from "./services/get-user-by-id.service";
import { CreateUserService } from "./services/create-user.service";
import { UpdateUserService } from "./services/update-user.service";
import { DeleteUserService } from "./services/delete-user.service";

import { UsersRepositoryDB } from "./repositories/users.repository.db";
import { AppDataSource } from "../../app/db/data-source";
import { UserEntity } from "./domain/entities/user.entity";

const router = Router();

let adminCtrl: UsersAdminController | null = null;
function getAdminCtrl(): UsersAdminController {
  if (!adminCtrl) {
    const repo = new UsersRepositoryDB(AppDataSource.getRepository(UserEntity));
    adminCtrl = new UsersAdminController(
      new ListUsersService(repo),
      new GetUserByIdService(repo),
      new CreateUserService(repo),
      new UpdateUserService(repo),
      new DeleteUserService(repo)
    );
  }
  return adminCtrl;
}

// 🔐🔒 admin-only
router.use(authenticateJWT, authorize("admin"));

// GET /api/admin/users?page=&limit=&q=
router.get("/",    permit("users.read"),  (req, res, next) => getAdminCtrl().list(req, res, next));

// GET /api/admin/users/:id
router.get("/:id", permit("users.read"),  (req, res, next) => getAdminCtrl().getById(req, res, next));

// POST /api/admin/users
router.post("/",   permit("users.create"), (req, res, next) => getAdminCtrl().create(req, res, next));

// PUT /api/admin/users/:id
router.put("/:id", permit("users.update"), (req, res, next) => getAdminCtrl().update(req, res, next));

// DELETE /api/admin/users/:id
router.delete("/:id", permit("users.delete"), (req, res, next) => getAdminCtrl().delete(req, res, next));

export default router;
