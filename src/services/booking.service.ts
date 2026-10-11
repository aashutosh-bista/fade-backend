import mongoose from "mongoose";
import { SLOT_CONFIG, generateSlotTimes } from "../config/slots.js";
import { ApiError } from "../utils/apiError.js";
import {
  DAY_MS,
  addDays,
  getNepalDateString,
  nepalToUtc,
} from "../utils/nepalTime.js";
import type {
  CreateBookingInput,
  ListBookingsQuery,
} from "../validators/booking.validator.js";
import { Booking, type Branch } from "../models/booking.model.js";

const assertDateInWindow = (date: string) => {
  const today = getNepalDateString();
  if (date < today) {
    throw new ApiError(400, "Cannot book a past date");
  }
  if (date > addDays(today, SLOT_CONFIG.maxDaysAhead)) {
    throw new ApiError(
      400,
      `Bookings open only ${SLOT_CONFIG.maxDaysAhead} days ahead`,
    );
  }
};

export const getSlotsService = async (branch: Branch, date: string) => {
  assertDateInWindow(date);

  const dayStart = nepalToUtc(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + DAY_MS);

  const booked = await Booking.find({
    branch,
    status: "booked",
    slotStart: { $gte: dayStart, $lt: dayEnd },
  }).select("slotStart");

  const bookedTimes = new Set(booked.map((b) => b.slotStart.getTime()));
  const now = new Date();

  return generateSlotTimes().map((time) => {
    const start = nepalToUtc(date, time);
    return {
      time,
      available: !bookedTimes.has(start.getTime()) && start > now,
    };
  });
};

export const createBookingService = async (data: CreateBookingInput) => {
  assertDateInWindow(data.date);

  if (!generateSlotTimes().includes(data.time)) {
    throw new ApiError(400, "Invalid time slot");
  }

  const slotStart = nepalToUtc(data.date, data.time);
  if (slotStart <= new Date()) {
    throw new ApiError(400, "This slot has already started");
  }

  try {
    return await Booking.create({
      name: data.name,
      number: data.number,
      email: data.email,
      branch: data.branch,
      slotStart,
    });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === 11000
    ) {
      throw new ApiError(409, "This slot is already booked");
    }
    throw err;
  }
};

export const listBookingsService = async (q: ListBookingsQuery) => {
  const filter: Record<string, unknown> = {};
  if (q.branch) filter.branch = q.branch;
  if (q.status) filter.status = q.status;
  if (q.date) {
    const start = nepalToUtc(q.date, "00:00");
    filter.slotStart = { $gte: start, $lt: new Date(start.getTime() + DAY_MS) };
  }

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ slotStart: 1 })
      .skip((q.page - 1) * q.limit)
      .limit(q.limit),
    Booking.countDocuments(filter),
  ]);
  return { items, total, page: q.page, limit: q.limit };
};

export const cancelBookingService = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid booking id");
  }
  const booking = await Booking.findOneAndUpdate(
    { _id: id, status: "booked" },
    { status: "cancelled" },
    { new: true },
  );
  if (!booking) {
    throw new ApiError(404, "Booking not found or already cancelled");
  }
  return booking;
};
