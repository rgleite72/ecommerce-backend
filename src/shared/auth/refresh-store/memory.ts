import { IRefreshStore } from "./types";

/**
 * Estrutura em memória:
 * userId -> (jti -> expEpochSec)
 */
export class MemoryRefreshStore implements IRefreshStore {
  private store = new Map<string, Map<string, number>>();

  async save(userId: string, jti: string, expEpochSec: number): Promise<void> {
    let byUser = this.store.get(userId);
    if (!byUser) {
      byUser = new Map<string, number>();
      this.store.set(userId, byUser);
    }
    byUser.set(jti, expEpochSec);
  }

  async isActive(userId: string, jti: string): Promise<boolean> {
    const byUser = this.store.get(userId);
    if (!byUser) return false;

    const now = Math.floor(Date.now() / 1000);

    // 1) Limpa JTIs expirados
    for (const [key, exp] of byUser.entries()) {
      if (exp <= now) {
        byUser.delete(key);
      }
    }

    // 2) Checa se o JTI pedido existe e ainda não expirou
    const expEpochSec = byUser.get(jti);
    if (!expEpochSec) return false;
    return expEpochSec > now;
  }

  async revoke(userId: string, jti: string): Promise<void> {
    const byUser = this.store.get(userId);
    if (!byUser) return;
    byUser.delete(jti);
  }

  async revokeAll(userId: string): Promise<void> {
    const byUser = this.store.get(userId);
    if (!byUser) return;
    byUser.clear(); // remove todos os JTIs do usuário
  }
}
