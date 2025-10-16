import { AddressEntity } from "../domain/entities/address.entity";
import type { IAddressRepository } from "../repositories/address.repository";
import type { CreateAddressDTO } from "../dto/create-address.dto";


export class CreateAddressService{

    constructor(private readonly repoAddress: IAddressRepository){}

    async execute(input: CreateAddressDTO): Promise<AddressEntity> {
        return this.repoAddress.create(input)
    }

}
