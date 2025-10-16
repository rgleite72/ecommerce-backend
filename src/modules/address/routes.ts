import { Router } from "express";
import { AddressController } from "./controllers/address.controller";

import { CreateAddressService } from "./services/create-address.service";
import { UpdateAddressService } from "./services/update-address.service";
import { ListAddressByCustomer } from "./services/list-address-by-customer.service";

import { AddressRepositoy } from "./repositories/address.repository.db";

import { AddressEntity } from "./domain/entities/address.entity";

import { authenticateJWT } from "../../app/middlewares/authenticateJWT";
import { permit } from "../../app/middlewares/permit";
import { AppDataSource } from "../../app/db/data-source";

// Cria dependências
const repo = new AddressRepositoy(AppDataSource.getRepository(AddressEntity));
const createSvc = new CreateAddressService(repo);
const updateSvc = new UpdateAddressService(repo);
const listSvc = new ListAddressByCustomer(repo);
const controller = new AddressController(createSvc, updateSvc, listSvc);

// Cria o router
export const addressRouter = Router();

addressRouter.use(authenticateJWT);

addressRouter.post("/:customerId", permit("addresses.create"),  (req, res) => controller.create(req, res))
addressRouter.patch("/:customerId/addresses/:addressId", permit("addresses.update"), (req, res) => controller.update(req, res))
addressRouter.get("/:customerId", permit("addresses.read"), (req, res) => controller.listByCustomer(req, res))


export default addressRouter;