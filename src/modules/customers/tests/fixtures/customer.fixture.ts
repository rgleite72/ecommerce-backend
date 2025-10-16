import type { CreateCustomerDTO } from "../../dto/create-customer.dto";

let counter = 0;
export function makeCreateCustomerDTO(partial?: Partial<CreateCustomerDTO>): CreateCustomerDTO {
  counter += 1;
  return {
    name: partial?.name ?? `User ${counter}`,
    email: partial?.email ?? `user${counter}@acme.com`,
    birthDate: partial?.birthDate,
    status: partial?.status ?? "active",
  };
}
