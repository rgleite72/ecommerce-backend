import { AddressEntity } from "../domain/entities/address.entity";
import type { IAddressRepository } from "../repositories/address.repository";
import type { UpdateAddressDTO } from "../dto/update-address.dto";


export class UpdateAddressService{

    constructor(private readonly repoAddress: IAddressRepository){}

    async execute(customerId: string, addressId: string, input: UpdateAddressDTO): Promise<AddressEntity| null>{
        
        return this.repoAddress.update(customerId, addressId, input)
  
    }


}