import { z } from 'zod'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'). transform((s) => s.trim()).optional(),
    email: z.string().max(160).transform(s => s.trim().toLowerCase()).refine( v => emailRegex.test(v), 'Email Inválido').optional(),
    role: z.enum(['user', 'admin']).optional(),
    password: z.string().min(8, 'Senha deve possuir pelo menos 8 caracteres').optional(),
})

export type UpdateUserDTO = z.infer<typeof updateUserSchema>

