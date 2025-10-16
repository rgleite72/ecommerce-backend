import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("permissions")
export class PermissionEntity {
  @PrimaryColumn({ type: "varchar", length: 100 })
  code!: string; // ex.: "users.read"

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
