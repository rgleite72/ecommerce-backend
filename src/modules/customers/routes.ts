// src/modules/customers/customer.routes.ts
import { Router } from "express";
import { authenticateJWT } from "../../app/middlewares/authenticateJWT";
import { permit } from "../../app/middlewares/permit";

// Controller + Services (classes)
import { CustomerController } from "./controllers/customer.controller";
import {
  CreateCustomerService,
  DeleteCustomerService,
  GetCustomerByEmailService,
  GetCustomerByIdService,
  ListCustomerService,
  SetLastPurchaseInfoService,
  UpdateCustomerService,
} from "./services";

// Repo concreto + DataSource + Entity
import { CustomerRepositoryDB } from "./repositories/customer.repository.db";
import { AppDataSource } from "../../app/db/data-source";
import { CustomerEntity } from "./domain/entities/customer.entity";

const router = Router();

// 🔁 Lazy singleton (evita inicializar DataSource cedo demais)
let ctrl: CustomerController | null = null;
function getCtrl(): CustomerController {
  if (!ctrl) {
    const repo = new CustomerRepositoryDB(AppDataSource.getRepository(CustomerEntity));
    ctrl = new CustomerController(
      new CreateCustomerService(repo),
      new DeleteCustomerService(repo),
      new GetCustomerByIdService(repo),
      new GetCustomerByEmailService(repo),
      new ListCustomerService(repo),
      new SetLastPurchaseInfoService(repo),
      new UpdateCustomerService(repo)
    );
  }
  return ctrl;
}

// 🔐 módulo /customers exige autenticação
router.use(authenticateJWT);

// REST clássico (com RBAC por rota)
router.post(
  "/",
  permit("customers.create"),
  (req, res) => getCtrl().create(req, res)
);

router.get(
  "/:id",
  permit("customers.read"),
  (req, res) => getCtrl().findById(req, res)
);

router.get(
  "/",
  permit("customers.list"),
  (req, res) => getCtrl().list(req, res)
);

// opcional: poderia ser query em "/" (ex.: /?email=foo@bar.com)
router.get(
  "/by-email",
  permit("customers.read"),
  (req, res) => getCtrl().findByEmail(req, res)
);

router.patch(
  "/:id",
  permit("customers.update"),
  (req, res) => getCtrl().update(req, res)
);

router.patch(
  "/:id/last-purchase",
  permit("customers.update"),
  (req, res) => getCtrl().updateLastPurchase(req, res)
);

router.delete(
  "/:id",
  permit("customers.delete"),
  (req, res) => getCtrl().softDelete(req, res)
);

export default router;
