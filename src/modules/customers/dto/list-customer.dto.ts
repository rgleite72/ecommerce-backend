import { z } from "zod";

// Tipos exportáveis (para usar no repository, service, etc.)
export type SortBy = "name" | "email" | "createdAt" | "lastPurchaseAt";
export type SortDir = "asc" | "desc";

export const listCustomerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().min(1).optional(),
  // filtros comuns que você pode querer já prever:
  status: z.enum(["active", "inactive"]).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  name: z.string().trim().min(1).optional(),
  // opcional: ordenação simples
  sortBy: z.enum(["name", "email", "createdAt", "lastPurchaseAt"]).default("createdAt").optional(),
  sortDir: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type ListCustomerQueryDTO = z.infer<typeof listCustomerQuerySchema>;
