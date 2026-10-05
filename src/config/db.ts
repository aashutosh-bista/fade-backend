import "dotenv/config";
import mongoose from "mongoose";

export const connectDb = async (providedUrl?: string) => {
  const MONGODB_URL = providedUrl ?? process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    throw new Error("Cannot get MONGODB_URL");
  }

  await mongoose.connect(MONGODB_URL);
  console.log("MongoDb connected successfully");
};
