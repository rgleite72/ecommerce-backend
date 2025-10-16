// src/modules/customers/controllers/customer.controller.ts
import { Request, Response } from "express";
import {
  CreateCustomerService,
  DeleteCustomerService,
  GetCustomerByEmailService,
  GetCustomerByIdService,
  ListCustomerService,
  SetLastPurchaseInfoService,
  UpdateCustomerService,
} from "../services";

import { createCustomerSchema } from "../dto/create-customer.dto";
import { updateCustomerSchema } from "../dto/update-customer.dto";
import { listCustomerQuerySchema } from "../dto/list-customer.dto";
import { emailQuerySchema } from "../dto/email-query.dto";
import { updateLastPurchaseSchema } from "../dto/update-last-purchase.dto";
import { idParamSchema } from "../dto/id-param.dto";
import type { UpdateLastPurchaseCommand } from "../services/set-last-purchase-info.service";


export class CustomerController {
  constructor(
    private readonly createSvc: CreateCustomerService,
    private readonly deleteSvc: DeleteCustomerService,
    private readonly getByIdSvc: GetCustomerByIdService,
    private readonly getByEmailSvc: GetCustomerByEmailService,
    private readonly listSvc: ListCustomerService,
    private readonly setLastSvc: SetLastPurchaseInfoService,
    private readonly updateSvc: UpdateCustomerService
  ) {}

  async create(req: Request, res: Response){
    const dto = createCustomerSchema.parse(req.body)
    const customer = await this.createSvc.execute(dto)
    return res.status(201).json(customer)
  }

  async findById (req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params)
    const customer = await this.getByIdSvc.execute(id)
    return res.json(customer)
  }

  async list(req: Request, res: Response) {
    const query = listCustomerQuerySchema.parse(req.query)
    const result = await this.listSvc.execute(query)
    return res.json(result) // { data, meta: { total, page, limit, hasNext } }
  }

  async findByEmail(req: Request, res: Response){
    const { email } = emailQuerySchema.parse(req.query)
    const customer = await this.getByEmailSvc.execute(email)
    return res.json(customer)
  }

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params)
    const dto = updateCustomerSchema.parse(req.body)
    const customer = await this.updateSvc.execute(id, dto)
    return res.json(customer)
  }


  async updateLastPurchase(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const dto = updateLastPurchaseSchema.parse(req.body);

    const cmd: UpdateLastPurchaseCommand = {
      at: dto.lastPurchaseAt,
      value: dto.lastPurchaseValue,
    };

    await this.setLastSvc.execute(id, cmd);
    return res.status(204).send();
  }

  async softDelete(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params)
    await this.deleteSvc.execute(id)
    return res.status(204).send()
  }
}
