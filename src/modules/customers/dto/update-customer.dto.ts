import { z } from 'zod'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const toYmd = (d: Date) => d.toISOString().slice(0, 10)

export const updateCustomerSchema = z.object({

    name: z.string().min(2, 'Deve possuir pelo menos 2 caracteres').trim(),
    email: z.string().max(255).transform(s => s.trim().toLowerCase()).refine(v => emailRegex.test(v), 'Email Inválido'),
    birthDate: z
            .union([
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),
                z.coerce.date(),
            ])
            .transform((v) => (v instanceof Date ? toYmd(v) : v))
            .optional(),
    lastPurchaseAt: z.coerce.date().optional(),
    lastPurchaseValue: z
        .union([z.coerce.number(), z.string()])
        .transform((v) => (typeof v === "number" ? v.toFixed(2) : v))
        .optional(),
    status: z.enum(["active", "inactive"]).optional(),

})

export type UpdateCustomerDTO = z.infer<typeof updateCustomerSchema>