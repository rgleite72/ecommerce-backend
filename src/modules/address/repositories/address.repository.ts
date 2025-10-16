import { AddressEntity } from "../domain/entities/address.entity";


export interface IAddressRepository{

    create( data: { customerId: string, street: string, streetNumber: string, city: string }): Promise<AddressEntity>
    update( customerId: string, addressId: string, data: { street?: string, streetNumber?: string, city?: string } ): Promise<AddressEntity | null>
    listByCustomerId(customerId: string): Promise<AddressEntity[]>

}

