// src/modules/customers/tests/doubles/in-memory-customers.repository.ts
import { randomUUID } from "crypto";
import { ICustomersRepository, PaginatedResult } from "../../repositories/customer.repository";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import type { CreateCustomerDTO } from "../../dto/create-customer.dto";
import type { UpdateCustomerDTO } from "../../dto/update-customer.dto";
import type { ListCustomerQueryDTO } from "../../dto/list-customer.dto";

// Clona preservando o prototype (métodos) e duplica Date via timestamp
const clone = (c: CustomerEntity): CustomerEntity => {
  const out = Object.assign(new CustomerEntity(), c);
  out.createdAt = new Date(c.createdAt.getTime());
  out.updatedAt = c.updatedAt ? new Date(c.updatedAt.getTime()) : undefined;
  out.lastPurchaseAt = c.lastPurchaseAt ? new Date(c.lastPurchaseAt.getTime()) : null;
  out.deletedAt = c.deletedAt ? new Date(c.deletedAt.getTime()) : null;
  return out;
};

export class InMemoryCustomersRepository implements ICustomersRepository {
  private items: CustomerEntity[] = [];

  async create(data: CreateCustomerDTO): Promise<CustomerEntity> {
    const now = new Date();

    const entity = Object.assign(new CustomerEntity(), {
      id: randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      birthDate: data.birthDate ?? null,
      lastPurchaseAt: null as Date | null,
      lastPurchaseValue: null as string | null,
      status: "active" as const,
      createdAt: now,
      updatedAt: now,
      deletedAt: null as Date | null,
    });

    this.items.push(entity);
    return clone(entity); // snapshot com métodos preservados
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const e = this.items.find(i => i.id === id) ?? null;
    return e ? clone(e) : null;
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const e = this.items.find(i => i.email === email.toLowerCase()) ?? null;
    return e ? clone(e) : null;
  }

  async existsEmail(email: string): Promise<boolean> {
    const e = email.toLowerCase();
    return this.items.some(i => i.email === e);
  }

  async existsEmailExceptId(email: string, exceptId: string): Promise<boolean> {
    const e = email.toLowerCase();
    return this.items.some(i => i.email === e && i.id !== exceptId);
  }

  async list(params: ListCustomerQueryDTO): Promise<PaginatedResult<CustomerEntity>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    let data = this.items.filter(i => !i.deletedAt);

    if (params.q) {
      const q = params.q.toLowerCase();
      data = data.filter(i => i.name.toLowerCase().includes(q) || i.email.includes(q));
    }

    if (params.email) {
      const email = params.email.toLowerCase();
      data = data.filter(i => i.email === email);
    }

    if (params.name) {
      const name = params.name.toLowerCase();
      data = data.filter(i => i.name.toLowerCase().includes(name));
    }

    if (params.status) {
      data = data.filter(i => i.status === params.status); // "active" | "inactive"
    }

    const total = data.length;
    const slice = data.slice((page - 1) * limit, page * limit);

    return {
      data: slice.map(clone),
      meta: { total, page, limit, hasNext: page * limit < total },
    };
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<CustomerEntity | null> {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return null;

    const current = this.items[idx];
    const updated = Object.assign(current, {
      ...data,
      email: data.email ? data.email.toLowerCase() : current.email,
      updatedAt: new Date(),
    });

    this.items[idx] = updated;
    return clone(updated);
  }

  async softDelete(id: string): Promise<void> {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.deletedAt = new Date();
      item.updatedAt = new Date();
      // opcional: item.status = "inactive" as const;
    }
  }

  async setLastPurchaseInfo(
    id: string,
    info: { lastPurchaseAt?: Date | null; lastPurchaseValue?: string | null }
  ): Promise<void> {
    const item = this.items.find(i => i.id === id);
    if (item) {
      if (info.lastPurchaseAt !== undefined) item.lastPurchaseAt = info.lastPurchaseAt;
      if (info.lastPurchaseValue !== undefined) item.lastPurchaseValue = info.lastPurchaseValue;
      item.updatedAt = new Date();
    }
  }
}
