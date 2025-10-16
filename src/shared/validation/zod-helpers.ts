import { ZodError, ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export function parseOrThrow<T extends ZodSchema, D = unknown>(schema: T, data: D) {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      const details = e.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        code: i.code,
      }));
      throw new AppError("Validation error", 422, { details });
    }
    throw e;
  }
}
