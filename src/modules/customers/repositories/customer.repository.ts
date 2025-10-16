import { CustomerEntity } from "../domain/entities/customer.entity";
import type { CreateCustomerDTO } from "../dto/create-customer.dto";
import type { UpdateCustomerDTO } from "../dto/update-customer.dto";
import type { ListCustomerQueryDTO } from "../dto/list-customer.dto";


export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
};

export interface ICustomersRepository {
  create(data: CreateCustomerDTO): Promise<CustomerEntity>;

  findById(id: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;

  existsEmail(email: string): Promise<boolean>;
  existsEmailExceptId(email: string, exceptId: string): Promise<boolean>;

  list(params: ListCustomerQueryDTO): Promise<PaginatedResult<CustomerEntity>>;

  update(id: string, data: UpdateCustomerDTO): Promise<CustomerEntity | null>;
  softDelete(id: string): Promise<void>;

  setLastPurchaseInfo(
  id: string,
  info: { lastPurchaseAt: Date; lastPurchaseValue: string }
): Promise<void>;
}
