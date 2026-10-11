import z from "zod";

export const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

// Nepali mobile: 96/97/98 + 8 digits, optional +977. Stored as 10 digits.
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(?:\+977)?9[678]\d{8}$/, "Invalid phone number"))
  .transform((v) => v.replace(/^\+977/, ""));

export const optionalEmailSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().toLowerCase().max(100, "Email is too long")
    .pipe(z.email("Invalid email address")).optional(),
);

export const optionalTextSchema = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});