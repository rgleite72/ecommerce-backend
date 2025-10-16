import { randomUUID } from "node:crypto";
import { IAddressRepository } from "../../repositories/address.repository";
import { AddressEntity } from "../../domain/entities/address.entity";


export class InMemoryAddressRepository implements IAddressRepository{

    private items: AddressEntity[] = []

    async create(data: { customerId: string; street: string; streetNumber: string; city: string; }): Promise<AddressEntity> {
        
        const now = new Date()

        const entity = Object.assign(new AddressEntity(), {
            id: randomUUID(),
            customerId: data.customerId,
            street: data.street,
            streetNumber: data.streetNumber,
            city: data.city,
            createdAt: now,   // <-- fix
            updatedAt: now,   // <-- fix
            deletedAt: null as Date | null, // <-- fix
            
        })

        this.items.push(entity)
        return entity

    }

    async update(customerId: string, addressId: string, data: { street?: string; streetNumber?: string; city?: string; }): Promise<AddressEntity | null> {
        const idx = this.items.findIndex(i => i.id === addressId && i.customerId === customerId)
        if (idx < 0) return null

        
        const current = this.items[idx];
        Object.assign(current, { ...data, updatedAt: new Date() }); // <-- fix naming

        return current; // simples e direto

    }

    async listByCustomerId(customerId: string): Promise<AddressEntity[]> {
        return this.items.filter(i => i.customerId === customerId && !i.deletedAt);

    }


}