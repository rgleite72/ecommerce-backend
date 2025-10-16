import { z } from "zod";

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});

export type ILogoutDTO = z.infer<typeof logoutSchema>;
