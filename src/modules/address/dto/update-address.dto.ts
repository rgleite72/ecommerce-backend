import { z } from 'zod'

const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


export const updateAddressSchema = z.object({
  customerId: z.string().regex(regexUUID, 'UUID Inválido'),
  street: z.string().trim().min(4).max(120).optional(),
  streetNumber: z.string().trim().min(1).max(10).optional(),
  city: z.string().trim().min(2).max(60).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
});

export type UpdateAddressDTO = z.infer<typeof updateAddressSchema>;







