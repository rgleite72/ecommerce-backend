import { Repository, Not } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { CustomerEntity } from "../domain/entities/customer.entity";
import type { ICustomersRepository, PaginatedResult } from "./customer.repository";

import type { CreateCustomerDTO } from "../dto/create-customer.dto";
import type { UpdateCustomerDTO } from "../dto/update-customer.dto";
import type {
  ListCustomerQueryDTO,
  SortBy,
  SortDir,
} from "../dto/list-customer.dto";

export class CustomerRepositoryDB implements ICustomersRepository {
  constructor(private readonly custRepo: Repository<CustomerEntity>) {}

  findById(id: string): Promise<CustomerEntity | null> {
    return this.custRepo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<CustomerEntity | null> {
    // Confiando que o controller já normalizou (lowercase) via schema/refine
    return this.custRepo.findOne({ where: { email } });
  }

  existsEmail(email: string): Promise<boolean> {
    return this.custRepo.exists({ where: { email } });
  }

  existsEmailExceptId(email: string, exceptId: string): Promise<boolean> {
    return this.custRepo.exists({ where: { email, id: Not(exceptId) } });
  }

  async create(data: CreateCustomerDTO): Promise<CustomerEntity> {
    const entity = this.custRepo.create(data);
    return this.custRepo.save(entity);
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<CustomerEntity | null> {
    const result = await this.custRepo
      .createQueryBuilder()
      .update(CustomerEntity)
      .set(data as QueryDeepPartialEntity<CustomerEntity>)
      .where("id = :id", { id })
      .returning("*")
      .execute();

    if (result.affected === 0) return null;
    return result.raw[0] as CustomerEntity;
  }

  async softDelete(id: string): Promise<void> {
    await this.custRepo.softDelete({ id });
  }

  async setLastPurchaseInfo(
    id: string,
    info: { lastPurchaseAt: Date; lastPurchaseValue: string }
  ): Promise<void> {
    await this.custRepo
      .createQueryBuilder()
      .update(CustomerEntity)
      .set(info as QueryDeepPartialEntity<CustomerEntity>)
      .where("id = :id", { id })
      .execute();
  }

  async list(params: ListCustomerQueryDTO): Promise<PaginatedResult<CustomerEntity>> {
    const { page, limit } = params; // já validados/coagidos no controller

    const qb = this.custRepo
      .createQueryBuilder("c")
      .where("c.deleted_at IS NULL");

    // Filtros opcionais
    if ("q" in params && params.q) {
      qb.andWhere("(c.name ILIKE :q OR c.email ILIKE :q)", { q: `%${params.q}%` });
    }
    if ("status" in params && params.status) {
      qb.andWhere("c.status = :status", { status: params.status });
    }
    if ("email" in params && params.email) {
      qb.andWhere("LOWER(c.email) = :email", { email: params.email.toLowerCase() });
    }
    if ("name" in params && params.name) {
      qb.andWhere("c.name ILIKE :name", { name: `%${params.name}%` });
    }

    // Ordenação segura (whitelist)
    const sortBy: SortBy = params.sortBy ?? "createdAt";
    const sortDir: SortDir = params.sortDir ?? "desc";

    const orderColumn =
      {
        name: "c.name",
        email: "c.email",
        createdAt: "c.created_at",
        lastPurchaseAt: "c.last_purchase_at",
      }[sortBy] ?? "c.created_at";

    const orderDir = sortDir === "asc" ? "ASC" : "DESC";
    qb.orderBy(orderColumn, orderDir)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, hasNext: page * limit < total },
    };
  }
}
