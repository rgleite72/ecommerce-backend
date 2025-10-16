import { Router } from "express";
import { authenticateJWT } from "../../app/middlewares/authenticateJWT";
import { permit } from "../../app/middlewares/permit";

// Controllers & Services
import { UsersController } from "./controllers/users.controller";
import { GetMeService } from "./services/get-me.service";
import { UpdateProfileService } from "./services/update-profile.service";

// Repo concreto + DataSource + Entity
import { UsersRepositoryDB } from "./repositories/users.repository.db";
import { AppDataSource } from "../../app/db/data-source";
import { UserEntity } from "./domain/entities/user.entity";

const router = Router();

// 🔁 Lazy singleton para evitar DataSource antes da hora
let usersCtrl: UsersController | null = null;
function getUsersCtrl(): UsersController {
  if (!usersCtrl) {
    const repo = new UsersRepositoryDB(AppDataSource.getRepository(UserEntity));
    usersCtrl = new UsersController(
      new GetMeService(repo),
      new UpdateProfileService(repo)
    );
  }
  return usersCtrl;
}

// 🔐 módulo /users exige autenticação
router.use(authenticateJWT);

// GET /api/users/me
router.get("/me",  permit("me.read"),   (req, res, next) => getUsersCtrl().me(req, res, next));

// PUT /api/users/me
router.put("/me", permit("me.update"),  (req, res, next) => getUsersCtrl().updateProfile(req, res, next));

export default router;
