import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      trim: true,
      maxLength: 100,
      lowercase: true,
    },
    number: {
      type: String,
      trim: true,
      required: true,
      maxLength: 15,
    },
    address: {
      type: String,
      trim: true,
      maxLength: 200,
    },
  },
  { timestamps: true, versionKey: false },
);

memberSchema.index({ email: 1 }, { unique: true, sparse: true });
memberSchema.index({ number: 1 }, { unique: true });
memberSchema.index({ createdAt: -1 });

export const Member = mongoose.model("Member", memberSchema);
