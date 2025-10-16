// src/modules/auth/services/login.service.ts
import { ICreateSessionDTO } from "../dto/create-session.dto";
import { AppError } from "../../../shared/errors/AppError";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { signAccess, signRefresh, decodeRefreshExp } from "../../../shared/auth/jwt";
import { refreshStore } from "../../../shared/auth/refresh-store";
import { AppDataSource } from "../../../app/db/data-source";
import { UserEntity } from "../../users/domain/entities/user.entity";


export class LoginService {
  async execute(input: ICreateSessionDTO) {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    const repo = AppDataSource.getRepository(UserEntity);
    const user = await repo.findOne({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new AppError("Invalid credentials", 401);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError("Invalid credentials", 401);
    }

    // ---- Tokens ----
    const accessToken = signAccess({ sub: user.id, email });
    const jti = randomUUID();
    const refreshToken = signRefresh({ sub: user.id, jti });
    const expEpochSec = decodeRefreshExp(refreshToken);

    await refreshStore.save(user.id, jti, expEpochSec);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
