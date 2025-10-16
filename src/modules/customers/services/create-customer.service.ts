import type { CreateCustomerDTO } from "../dto/create-customer.dto";
import { CustomerEntity } from "../domain/entities/customer.entity";
import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";

export class CreateCustomerService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(input: CreateCustomerDTO): Promise<CustomerEntity> {
    if (await this.repo.existsEmail(input.email)) {
      throw new AppError("E-mail já utilizado", 409);
    }
    return this.repo.create(input);
  }
}
