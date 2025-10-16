import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { AddressEntity } from "../../../address/domain/entities/address.entity";

export type CustomerStatus = "active" | "inactive";


@Entity('customers')
@Index('IDX_Customer_Email_unique', ['email'], {unique: true} )
export class CustomerEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: 'varchar', length: 120})
    name!: string

    @Column({type: 'varchar', length: 255})
    email!: string

    @Column({name: 'birth_date', type: 'date', nullable: true})
    birthDate?: string | null 

    @Column({ name: "last_purchase_at", type: "timestamptz", nullable: true })
    lastPurchaseAt?: Date | null;

    @Column({ name: 'last_purchase_value', type: 'numeric', precision: 12, scale: 2, nullable: true})
    lastPurchaseValue?: string | null

    @Column({ name: 'status', length: 10, default: 'active'})
    status!: CustomerStatus

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true})
    updatedAt?: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true})
    deletedAt?: Date | null

    //CustomerEntity (lado inverso ao Address, só o essencial)
    @OneToMany(() => AddressEntity, (a) => a.customer, { cascade: false, eager: false })
    addresses!: AddressEntity[];


    static create(props: {name: string; email: string; birthDate?: string | null ; lastPurchaseAt?: Date | null; 
                        lastPurchaseValue?: string | null; status?: CustomerStatus}) {
                            const c = new CustomerEntity()
                            c.name = props.name.trim()
                            c.email = props.email.trim().toLowerCase()
                            c.birthDate = props.birthDate?.trim() ?? null
                            c.lastPurchaseAt = props.lastPurchaseAt ?? null
                            c.lastPurchaseValue = props.lastPurchaseValue ?? null
                            c.status = props.status ?? 'active'
                            return c

                        }

    rename(name: string) {this.name = name.trim()}
    changeEmail(email: string){ this.email = email.trim().toLowerCase() }
    softDelete() { this.deletedAt = new Date()}


       


}



