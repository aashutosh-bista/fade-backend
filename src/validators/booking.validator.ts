import z from "zod";
import { BRANCHES } from "../models/booking.model.js";
import { isRealDate } from "../utils/nepalTime.js";
import { optionalEmailSchema, paginationSchema, phoneSchema } from "./common.validator.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine(isRealDate, "Invalid date");

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:mm");

export const createBookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  number: phoneSchema,
  email: optionalEmailSchema,
  branch: z.enum(BRANCHES),
  date: dateSchema,
  time: timeSchema,
});

export const slotsQuerySchema = z.object({
  branch: z.enum(BRANCHES),
  date: dateSchema,
});

export const listBookingsQuerySchema = paginationSchema.extend({
  branch: z.enum(BRANCHES).optional(),
  date: dateSchema.optional(),
  status: z.enum(["booked", "cancelled"]).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;