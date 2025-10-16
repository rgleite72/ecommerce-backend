import { z } from 'zod'

export const listUserQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(100),
    q: z.string().transform((s) => s.trim()).optional(),

})

export type ListUserQueryDTO = z.infer<typeof listUserQuerySchema>
