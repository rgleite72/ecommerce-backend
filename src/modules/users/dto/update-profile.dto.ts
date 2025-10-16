import { z } from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').transform((s) => s.trim()),

})

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>

