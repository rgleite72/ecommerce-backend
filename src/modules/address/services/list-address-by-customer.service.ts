import { AddressEntity } from "../domain/entities/address.entity";
import type { IAddressRepository } from "../repositories/address.repository";


export class ListAddressByCustomer{

    constructor(private readonly repoAddress: IAddressRepository){}

    async execute(customerId: string): Promise<AddressEntity[] | null>{
        return (await this.repoAddress.listByCustomerId(customerId)).filter(r => r.deletedAt)


    }


}