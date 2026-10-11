import z from "zod";
import { optionalEmailSchema, optionalTextSchema, phoneSchema } from "./common.validator.js";

export const createMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  number: phoneSchema,
  email: optionalEmailSchema,
  address: optionalTextSchema(200),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;