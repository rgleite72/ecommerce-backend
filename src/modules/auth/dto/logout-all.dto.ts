import { z } from "zod";

export const logoutAllSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export type ILogoutAllDTO = z.infer<typeof logoutAllSchema>;
