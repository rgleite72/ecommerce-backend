import type { CreateAddressDTO } from "../../dto/create-address.dto";
import { randomUUID } from "node:crypto";


let counter = 0
export function makeCreateAddressDTO(partial?: Partial<CreateAddressDTO>): CreateAddressDTO{
    counter += 1
    return{
        customerId: partial?.customerId ?? randomUUID(),
        street: partial?.street ?? `street ${counter}`,
        streetNumber: partial?.streetNumber ?? String(counter),
        city: partial?.city ?? `city ${counter}`,
    }
}


