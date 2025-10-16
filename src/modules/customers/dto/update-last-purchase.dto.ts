import { z } from "zod";

export const updateLastPurchaseSchema = z.object({
  lastPurchaseAt: z.coerce.date(),                // aceita string e vira Date
  lastPurchaseValue: z.number().nonnegative(), // aceita string e vira number
}).strict();

export type UpdateLastPurchaseDTO = z.infer<typeof updateLastPurchaseSchema>;




