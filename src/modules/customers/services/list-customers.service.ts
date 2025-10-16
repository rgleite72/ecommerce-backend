import type { ICustomersRepository, PaginatedResult } from "../repositories/customer.repository";
import type { ListCustomerQueryDTO } from "../dto/list-customer.dto";
import type { CustomerEntity } from "../domain/entities/customer.entity";

export class ListCustomerService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(params: ListCustomerQueryDTO): Promise<PaginatedResult<CustomerEntity>> {
    return this.repo.list(params);
  }
}
