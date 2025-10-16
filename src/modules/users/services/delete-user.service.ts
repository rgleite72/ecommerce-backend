import type { IUsersRepository } from "../repositories/users.repository";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteUserService {
  constructor(private repo: IUsersRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError("User not found", 404);

    // Soft delete via Entity + repo
    existing.softDelete?.();
    await this.repo.softDelete(id);
  }
}
