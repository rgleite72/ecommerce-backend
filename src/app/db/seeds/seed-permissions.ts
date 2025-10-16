import { AppDataSource } from "../data-source";
import { PermissionEntity } from "../../../modules/rbac/domain/entities/permission.entity";
import { RolePermissionEntity } from "../../../modules/rbac/domain/entities/role-permission.entity";
import type { PermissionCode } from "../../../types/permissions";

const perms: { code: PermissionCode; description: string }[] = [
  { code: "users.read",   description: "Listar e consultar usuários" },
  { code: "users.create", description: "Criar usuários" },
  { code: "users.update", description: "Atualizar usuários" },
  { code: "users.delete", description: "Excluir usuários" },
  { code: "me.read",      description: "Ler perfil próprio" },
  { code: "me.update",    description: "Atualizar perfil próprio" },
];

const rolePerms: Record<"user" | "admin", PermissionCode[]> = {
  user:  ["me.read", "me.update"],
  admin: ["me.read", "me.update", "users.read", "users.create", "users.update", "users.delete"],
};

async function run() {
  await AppDataSource.initialize();
  const permRepo = AppDataSource.getRepository(PermissionEntity);
  const rpRepo   = AppDataSource.getRepository(RolePermissionEntity);

  // upsert permissions
  for (const p of perms) {
    const exists = await permRepo.findOne({ where: { code: p.code } });
    if (!exists) {
      await permRepo.save(permRepo.create({ code: p.code, description: p.description }));
    }
  }

  // upsert role_permissions
  for (const [role, codes] of Object.entries(rolePerms) as [("user"|"admin"), PermissionCode[]][]) {
    for (const code of codes) {
      const exists = await rpRepo.findOne({ where: { role, permissionCode: code } });
      if (!exists) {
        await rpRepo.save(rpRepo.create({ role, permissionCode: code }));
      }
    }
  }

  console.log("[seed] permissions & role_permissions ok");
  await AppDataSource.destroy();
}

run().catch((e) => {
  console.error("[seed] failed", e);
  process.exit(1);
});
