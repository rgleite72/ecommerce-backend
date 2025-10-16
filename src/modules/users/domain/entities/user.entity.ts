import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
    UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity("users")
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column({type: "varchar", length: 255, unique: true})
    email!: string

    @Column({type: "varchar", length: 10, default: 'user'})
    role!: "user" | "admin"

    @Column({type: "varchar", length: 72, name: "password_hash", nullable: true})
    passwordHash?: string | null

    @CreateDateColumn({ name: "created_at"})
    createdAt!: Date
    
    @UpdateDateColumn({ name: "updated_at"})
    updatedAt!: Date

    @DeleteDateColumn({ name: "deleted_at", nullable: true})
    deletedAt!: Date | null


  static create(props: { name: string; email: string; role?: "user" | "admin"; passwordHash?: string | null }) {
    const u = new UserEntity();
    u.name = props.name.trim();
    u.email = props.email.trim().toLowerCase();
    u.role = props.role ?? "user";
    u.passwordHash = props.passwordHash ?? null;
    return u;
  }

  rename(name: string) { this.name = name.trim(); }
  changeEmail(email: string) { this.email = email.trim().toLowerCase(); }
  softDelete() { this.deletedAt = new Date(); }

  toJSONSafe() {
    const { passwordHash: _passwordHash, ...safe } = this;
    return safe;
  }  

}

