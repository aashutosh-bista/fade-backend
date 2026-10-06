import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      maxLength: 100,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true, versionKey: false },
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
export const User = mongoose.model("User", userSchema);
