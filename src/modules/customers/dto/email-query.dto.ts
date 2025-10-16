import { z } from "zod";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lida com array do Express (?email=a&email=b) pegando o 1º valor
const pickFirst = (v: unknown) => Array.isArray(v) ? v[0] : v;

export const emailQuerySchema = z.object({
  email: z.preprocess(
    pickFirst,
    z.string()
      .max(255)
      .transform(s => s.trim().toLowerCase())
      .refine(v => emailRegex.test(v), "Email inválido")
  ),
});

export type EmailQueryDTO = z.infer<typeof emailQuerySchema>;
