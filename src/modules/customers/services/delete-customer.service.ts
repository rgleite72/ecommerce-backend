import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";

export class DeleteCustomerService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new AppError("Customer não encontrado", 404);
    await this.repo.softDelete(id);
  }
}
