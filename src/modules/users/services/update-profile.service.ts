import type { IUsersRepository } from "../repositories/users.repository";
import { AppError } from "../../../shared/errors/AppError";
import bcrypt from "bcrypt";

// Perfil: segurança padrão → não altera role, nem e-mail
type UpdateProfileDTO = {
  name?: string;
  password?: string;
};

export class UpdateProfileService {
  constructor(private repo: IUsersRepository) {}

  async execute(authenticatedUserId: string, dto: UpdateProfileDTO) {
    const existing = await this.repo.findById(authenticatedUserId);
    if (!existing) throw new AppError("User not found", 404);

    const payload: Partial<{ name: string; passwordHash: string | null }> = {};

    if (typeof dto.name === "string") payload.name = dto.name;

    if (typeof dto.password === "string") {
      payload.passwordHash = await bcrypt.hash(
        dto.password,
        Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
      );
    }

    const updated = await this.repo.update(authenticatedUserId, payload);
    return updated.toJSONSafe ? updated.toJSONSafe() : updated;
  }
}
