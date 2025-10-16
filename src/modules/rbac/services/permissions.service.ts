import { AppDataSource } from "../../../app/db/data-source";
import { RolePermissionEntity } from "../domain/entities/role-permission.entity";
import type { PermissionCode, Role } from "../../../types/permissions";


class PermissionsService {
  private cache = new Map<Role, Set<PermissionCode>>();
  private loading = false;

  private async loadIfNeeded() {
    if (this.cache.size > 0 || this.loading) return;
    this.loading = true;
    try {
      const rpRepo = AppDataSource.getRepository(RolePermissionEntity);
      const rows = await rpRepo.find(); // (role, permissionCode)
      const map = new Map<Role, Set<PermissionCode>>();
      for (const row of rows) {
        const r = row.role as Role;
        const set = map.get(r) ?? new Set<PermissionCode>();
        set.add(row.permissionCode as PermissionCode);
        map.set(r, set);
      }
      this.cache = map;
    } finally {
      this.loading = false;
    }
  }

  async roleHas(role: Role, perm: PermissionCode): Promise<boolean> {
    await this.loadIfNeeded();
    return this.cache.get(role)?.has(perm) ?? false;
  }
}

// singleton simples
export const permissionsService = new PermissionsService();
