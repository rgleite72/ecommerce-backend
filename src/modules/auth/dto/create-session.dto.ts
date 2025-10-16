import { z } from 'zod'

export const createSessionSchema = z.object({
    email: z.string().max(160).pipe(z.email()),
    password: z.string().min(8).max(64),

})

export type ICreateSessionDTO = z.infer<typeof createSessionSchema>

