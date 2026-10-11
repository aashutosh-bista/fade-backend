import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/user.model.js";
import { passwordHasher } from "../utils/password.js";
import { signUpSchema } from "../validators/auth.validator.js";

const run = async () => {
  const parsed = signUpSchema.safeParse({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  if (!parsed.success) {
    console.error("Invalid ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env:");
    for (const issue of parsed.error.issues) {
      console.error(`- ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  const { name, email, password } = parsed.data;

  await connectDb();

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      console.log("Admin already exists, nothing to do");
      return;
    }
    throw new Error("A non-admin user with this email exists. Use another email or change its role manually.");
  }

  const passwordHash = await passwordHasher(password);
  await User.create({ name, email, passwordHash, role: "admin" });
  console.log(`Admin created: ${email}`);
};

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Seed failed:", err instanceof Error ? err.message : err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });