import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  return error.errors.map((err) => ({
    name: err.path.join("."),
    message: err.message,
  }));
}
