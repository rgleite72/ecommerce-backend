import type { IAddressRepository } from "./address.repository";
import { AddressEntity } from "../domain/entities/address.entity";
import { Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";


export class AddressRepositoy implements IAddressRepository{

    constructor(private readonly repoAddress: Repository<AddressEntity> ){}

    async create(data: { customerId: string; street: string; streetNumber: string; city: string; }): Promise<AddressEntity> {
        const created = this.repoAddress.create(data)
        return this.repoAddress.save(created)

    }

    async update(customerId: string, addressId: string, data: Partial<AddressEntity>) {
    const result = await this.repoAddress
        .createQueryBuilder()
        .update(AddressEntity)
        .set(data as QueryDeepPartialEntity<AddressEntity>)
        .where("id = :addressId AND customer_id = :customerId", { addressId, customerId })
        .returning("*")
        .execute();

    if (result.affected === 0) return null;
    return result.raw[0] as AddressEntity;
    }

    async listByCustomerId(customerId: string): Promise<AddressEntity[]> {
        return this.repoAddress.find({ where: {customerId} })
    }


}

