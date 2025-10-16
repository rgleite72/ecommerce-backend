// tests/e2e/helpers/seed.ts
import { AppDataSource } from "../../../src/app/db/data-source";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

import { UserEntity } from "../../../src/modules/users/domain/entities/user.entity";
import { PermissionEntity } from "../../../src/modules/rbac/domain/entities/permission.entity";
import { RolePermissionEntity } from "../../../src/modules/rbac/domain/entities/role-permission.entity";

export async function seedPermissionsAndRoles() {
  const permRepo: Repository<PermissionEntity> = AppDataSource.getRepository(PermissionEntity);
  const rpRepo: Repository<RolePermissionEntity> = AppDataSource.getRepository(RolePermissionEntity);

  const perms = [
    { code: "users.read", description: "Listar e consultar usuários" },
    { code: "users.create", description: "Criar usuários" },
    { code: "users.update", description: "Atualizar usuários" },
    { code: "users.delete", description: "Excluir usuários" },
    { code: "me.read", description: "Ler perfil próprio" },
    { code: "me.update", description: "Atualizar perfil próprio" },
  ];

  for (const p of perms) {
    const exists = await permRepo.findOne({ where: { code: p.code } });
    if (!exists) await permRepo.save(permRepo.create(p));
  }

  const rolePerms: Record<"user" | "admin", string[]> = {
    user: ["me.read", "me.update"],
    admin: ["me.read", "me.update", "users.read", "users.create", "users.update", "users.delete"],
  };

  for (const [role, codes] of Object.entries(rolePerms) as [("user" | "admin"), string[]][]) {
    for (const code of codes) {
      const exists = await rpRepo.findOne({ where: { role, permissionCode: code } });
      if (!exists) await rpRepo.save(rpRepo.create({ role, permissionCode: code }));
    }
  }
}

export async function seedUsers() {
  const repo = AppDataSource.getRepository(UserEntity);

  await repo.createQueryBuilder().delete().from(UserEntity).execute();

  const admin = repo.create({
    name: "Admin",
    email: "admin@acme.com",
    role: "admin",
    passwordHash: await bcrypt.hash("Admin#123", 10),
  });

  const user = repo.create({
    name: "User",
    email: "user@acme.com",
    role: "user",
    passwordHash: await bcrypt.hash("User#123", 10),
  });

  await repo.save([admin, user]);
}
