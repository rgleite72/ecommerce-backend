// src/modules/users/services/update-user.service.ts
import type { IUsersRepository, UpdateUserInput } from "../repositories/users.repository";
import type { UpdateUserDTO } from "../dto/update-user.dto";
import { AppError } from "../../../shared/errors/AppError";
import bcrypt from "bcrypt";


export class UpdateUserService {
  constructor(private readonly repo: IUsersRepository) {}

  async execute(id: string, data: UpdateUserDTO) {
    const user = await this.repo.findById(id);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }

    const payload: UpdateUserInput = {};

    if (data.name) {
      payload.name = data.name.trim();
    }

    if (data.email) {
      const normalized = data.email.trim().toLowerCase();
      if (normalized !== user.email) {
        const exists = await this.repo.findByEmail(normalized);
        if (exists && exists.id !== user.id) {
          throw new AppError("Email already in use", 409);
        }
      }
      payload.email = normalized;
    }

    if (data.role) {
      // Se houver governança, valide aqui (ex.: somente admin promove).
      payload.role = data.role;
    }

    if (data.password) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
      payload.passwordHash = await bcrypt.hash(data.password, saltRounds);
    }

    const updated = await this.repo.update(id, payload);

    // Retorno seguro (sem hash)
    return updated.toJSONSafe ? updated.toJSONSafe() : { ...updated, passwordHash: undefined };
  }
}
