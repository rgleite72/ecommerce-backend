// src/modules/customers/services/update-customer.service.ts
import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";
import type { UpdateCustomerDTO } from "../dto/update-customer.dto";

export class UpdateCustomerService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(id: string, input: UpdateCustomerDTO) {
    const current = await this.repo.findById(id);
    if (!current) throw new AppError("Customer não encontrado", 404);
    if (current.deletedAt) throw new AppError("Operação não permitida", 409);

    // Name (se veio)
    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name) throw new AppError("Nome não pode ser vazio", 400);
      input.name = name;
    }

    // Email (se veio)
    if (input.email !== undefined) {
      const email = input.email.trim().toLowerCase();

      // só valida conflito se está tentando mudar
      if (email !== current.email) {
        // 🔒 checagem robusta: busca o dono do e-mail
        const owner = await this.repo.findByEmail(email);
        if (owner && owner.id !== id) {
          throw new AppError("E-mail já utilizado", 409);
        }
      }

      input.email = email;
    }

    const updated = await this.repo.update(id, input);
    return updated!;
  }
}
