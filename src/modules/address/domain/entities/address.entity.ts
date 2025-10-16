// src/modules/addresses/domain/entities/address.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CustomerEntity } from '../../../customers/domain/entities/customer.entity';

@Entity('address')
@Index('idx_address_customer_id', ['customerId'])
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // FK crua para consultas simples e DTOs
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  // Relação owner: Address → Customer (N:1)
  @ManyToOne(() => CustomerEntity, (c) => c.addresses, {
    onDelete: 'RESTRICT', // nada de cascade em soft-delete
    onUpdate: 'NO ACTION',
    eager: false,
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerEntity;

  @Column({ type: 'varchar', length: 120 })
  street!: string;

  @Column({ name: 'street_number', type: 'varchar', length: 10 })
  streetNumber!: string;

  @Column({ type: 'varchar', length: 60 })
  city!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

    static create(props: { customerId: string; street: string; streetNumber: string; city: string }) {
    const a = new AddressEntity();
    a.customerId = props.customerId;
    a.street = props.street?.trim() ?? '';
    a.streetNumber = props.streetNumber?.trim() ?? '';
    a.city = props.city?.trim() ?? '';
    return a;
    }


  rename(street: string, streetNumber: string, city: string) {
    this.street = street.trim();
    this.streetNumber = streetNumber.trim();
    this.city = city.trim();
  }
}
