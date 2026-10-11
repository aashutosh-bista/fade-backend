import mongoose from "mongoose";

export const BRANCHES = ["branch1", "branch2"] as const; // replace with the real branch names

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    number: {
      type: String,
      required: true,
      trim: true,
      maxLength: 15,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 100,
    },
    branch: {
      type: String,
      required: true,
      enum: BRANCHES,
    },
    slotStart: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true, versionKey: false }
);


bookingSchema.index(
  { branch: 1, slotStart: 1 },
  { unique: true, partialFilterExpression: { status: "booked" } }
);
bookingSchema.index({ number: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
export type Branch = (typeof BRANCHES)[number];