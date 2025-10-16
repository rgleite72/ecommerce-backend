import { Response, Request } from "express";

import { CreateAddressService } from "../services/create-address.service";
import { UpdateAddressService } from "../services/update-address.service";
import { ListAddressByCustomer } from "../services/list-address-by-customer.service";

import  { createAddressSchema } from "../dto/create-address.dto";
import  { updateAddressSchema } from "../dto/update-address.dto";
import  { listAddressesByCustomerSchema } from "../dto/list-addresses-by-customer.dto";


export class AddressController{

    constructor(private readonly createSvc: CreateAddressService,
                private readonly updateSvc: UpdateAddressService,
                private readonly listSvc: ListAddressByCustomer

    ){}


    async create(req: Request, res: Response){
        const dto = createAddressSchema.parse(req.body)
        const address = await this.createSvc.execute(dto)
        return res.status(201).json(address)

    }


    async update(req: Request, res: Response) {
        const { customerId, addressId } = req.params;
        const dto = updateAddressSchema.parse(req.body);
        const updated = await this.updateSvc.execute(customerId, addressId, dto);
        return res.json(updated);
    }

    async listByCustomer(req: Request, res: Response) {
        const { id } = listAddressesByCustomerSchema.parse(req.params); // customerId
        const addresses = await this.listSvc.execute(id);
        return res.json(addresses);
    }


}
