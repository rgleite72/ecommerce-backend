// src/modules/auth/dto/refresh.dto.ts
import { z } from "zod";

export const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export type IRefreshDTO = z.infer<typeof refreshSchema>;
