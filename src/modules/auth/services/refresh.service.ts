// src/modules/auth/services/refresh.service.ts
import { randomUUID } from "crypto";
import { AppError } from "../../../shared/errors/AppError";
import {
  verifyRefresh,
  signAccess,
  signRefresh,
  decodeRefreshExp,
} from "../../../shared/auth/jwt";

import { refreshStore } from "../../../shared/auth/refresh-store";

// Opcional: manter alinhado ao seu seed atual
const SEED_EMAIL = "test@example.com";

type Input = { refreshToken: string };
type Output = { accessToken: string; refreshToken: string };

export class RefreshService {
  /**
   * Executa a rotação de refresh:
   * 1) valida token recebido
   * 2) checa store (ativo)
   * 3) revoga jti antigo
   * 4) emite novo par (access + refresh com novo jti)
   * 5) persiste novo jti
   */
  async execute({ refreshToken }: Input): Promise<Output> {
    // 1) Presença
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new AppError("Missing refresh token", 400);
    }

    // 2) Verifica assinatura e extrai claims
    const { sub: userId, jti: oldJti } = verifyRefresh(refreshToken);

    // 3) Checa se ainda está ativo no store
    const active = await refreshStore.isActive(userId, oldJti);
    if (!active) {
      throw new AppError("Invalid refresh token", 401);
    }

    // 4) Gera novo par
    const newAccess = signAccess({ sub: userId, email: SEED_EMAIL });
    const newJti = randomUUID();
    const newRefresh = signRefresh({ sub: userId, jti: newJti });
    const newExp = decodeRefreshExp(newRefresh);

    // 5) Rotaciona: revoga antigo e salva o novo
    await refreshStore.revoke(userId, oldJti);
    await refreshStore.save(userId, newJti, newExp);

    // 6) Retorna o novo par
    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
    };
  }

  async revokeOne(refreshToken: string): Promise<void> {
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new AppError("Missing refresh token", 400);
    }
    const { sub: userId, jti } = verifyRefresh(refreshToken);
    await refreshStore.revoke(userId, jti);
  }

  async revokeAll(userId: string): Promise<void> {
    if (!userId) throw new AppError("Missing user id", 400);
    await refreshStore.revokeAll(userId);
  }

}
