import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBookings,
  getSlots,
} from "../controllers/booking.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { bookingLimiter } from "../middlewares/rateLimitter.middleware.js";

const router = Router();

// Public
router.get("/slots", getSlots);
router.post("/", bookingLimiter, createBooking);

// Admin only
router.get("/", authenticate, authorize("admin"), getBookings);
router.patch("/:id/cancel", authenticate, authorize("admin"), cancelBooking);

export default router;