import { z } from 'zod'

const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


export const listAddressesByCustomerSchema = z.object({
    id: z.string().regex(regexUUID, 'UUID Inválido'),

})


export type ListAddressesByCustomerDTO = z.infer<typeof listAddressesByCustomerSchema>
