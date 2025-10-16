import type { IUsersRepository } from "../repositories/users.repository";
import { AppError } from "../../../shared/errors/AppError";

export class GetMeService {
  constructor(private repo: IUsersRepository) {}

  async execute(authenticatedUserId: string) {
    const me = await this.repo.findById(authenticatedUserId);
    if (!me) throw new AppError("User not found", 404);
    return me.toJSONSafe ? me.toJSONSafe() : me;
  }
}
