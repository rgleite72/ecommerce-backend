
// src/modules/customers/services/set-last-purchase-info.service.ts
import { AppError } from "../../../shared/errors/AppError";
import type { ICustomersRepository } from "../repositories/customer.repository";

// Entrada do SERVICE (limpa para o domínio)
export type UpdateLastPurchaseCommand = {
  at: Date;
  value: number;
};

export class SetLastPurchaseInfoService {
  constructor(private readonly repo: ICustomersRepository) {}

  async execute(id: string, cmd: UpdateLastPurchaseCommand): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new AppError("Customer não encontrado", 404);

    if (cmd.value < 0) throw new AppError("Valor inválido", 400);
    if (exists.deletedAt) throw new AppError("Operação não permitida para customer deletado", 409);
    // Se tiver status Inactive:
    // if (exists.status === "Inactive") throw new AppError("Operação não permitida", 409);

    // Mapeia para o contrato do repositório (decimal → string)
  await this.repo.setLastPurchaseInfo(id, {
    lastPurchaseAt: cmd.at,
    lastPurchaseValue: cmd.value.toFixed(2), // string "199.90"
   });
  }
}
