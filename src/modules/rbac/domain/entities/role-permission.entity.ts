import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";

@Entity("role_permissions")
export class RolePermissionEntity {
  @PrimaryColumn({ type: "varchar", length: 10 })
  role!: "user" | "admin";

  @PrimaryColumn({ name: "permission_code", type: "varchar", length: 100 })
  permissionCode!: string;

  @ManyToOne(() => PermissionEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_code", referencedColumnName: "code" })
  permission!: PermissionEntity;
}
