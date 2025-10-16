import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";
import type { CustomerEntity } from "../domain/entities/customer.entity";

export class GetCustomerByEmailService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(email: string): Promise<CustomerEntity> {
    const customer = await this.repo.findByEmail(email);
    if (!customer) throw new AppError("Customer não encontrado", 404);
    return customer;
  }
}
