import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import {
  createBookingSchema,
  listBookingsQuerySchema,
  slotsQuerySchema,
} from "../validators/booking.validator.js";
import {
  cancelBookingService,
  createBookingService,
  getSlotsService,
  listBookingsService,
} from "../services/booking.service.js";

export const getSlots = asyncHandler(async (req, res) => {
  const { branch, date } = slotsQuerySchema.parse(req.query);
  const slots = await getSlotsService(branch, date);
  res.status(200).json(apiResponse("Slots fetched successfully", slots));
});

export const createBooking = asyncHandler(async (req, res) => {
  const data = createBookingSchema.parse(req.body);
  const booking = await createBookingService(data);
  res.status(201).json(apiResponse("Booking created successfully", booking));
});

export const getBookings = asyncHandler(async (req, res) => {
  const query = listBookingsQuerySchema.parse(req.query);
  const result = await listBookingsService(query);
  res.status(200).json(apiResponse("Bookings fetched successfully", result));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBookingService(String(req.params.id));
  res.status(200).json(apiResponse("Booking cancelled successfully", booking));
});
