import { z } from 'zod'

const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


export const createAddressSchema = z.object({

    customerId: z.string().regex(regexUUID, 'UUID Inválido'),
    street: z.string().trim().min(4, 'Minimo de 4 caracteres').max(120, 'Máximo de 120 caracteres'),
    streetNumber: z.string().trim().min(1, 'Informe o número').max(10, 'Máximo de 10 caracteres'),
    city: z.string().trim().min(2, 'Minimo de 2 caracteres').max(60, 'Maximo de 60 caracteres'),
    
})

export type CreateAddressDTO = z.infer<typeof createAddressSchema>;