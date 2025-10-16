import { AppDataSource } from "../../../app/db/data-source";
import { CustomerEntity } from "../domain/entities/customer.entity";
import { CustomerRepositoryDB } from "../repositories/customer.repository.db";

import { CreateCustomerService } from "./create-customer.service";
import { GetCustomerByIdService } from "./get-customer-by-id.service";
import { GetCustomerByEmailService } from "./get-customer-by-email.service";
import { ListCustomerService } from "./list-customers.service";
import { UpdateCustomerService } from "./update-customer.service";
import { DeleteCustomerService } from "./delete-customer.service";
import { SetLastPurchaseInfoService } from "./set-last-purchase-info.service";

// Reexport classes (tipagem no Controller)
export {
  CreateCustomerService,
  GetCustomerByIdService,
  GetCustomerByEmailService,
  ListCustomerService,
  UpdateCustomerService,
  DeleteCustomerService,
  SetLastPurchaseInfoService,
};

// Repo concreto
const repo = new CustomerRepositoryDB(AppDataSource.getRepository(CustomerEntity));

// Instâncias para wire-up (router/factory)
export const createCustomerService = new CreateCustomerService(repo);
export const getCustomerByIdService = new GetCustomerByIdService(repo);
export const getCustomerByEmailService = new GetCustomerByEmailService(repo);
export const listCustomersService = new ListCustomerService(repo);
export const updateCustomerService = new UpdateCustomerService(repo);
export const deleteCustomerService = new DeleteCustomerService(repo);
export const setLastPurchaseInfoService = new SetLastPurchaseInfoService(repo);
