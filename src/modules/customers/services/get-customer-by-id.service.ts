import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";
import type { CustomerEntity } from "../domain/entities/customer.entity";

export class GetCustomerByIdService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.repo.findById(id);
    if (!customer) throw new AppError("Customer não encontrado", 404);
    return customer;
  }
}
