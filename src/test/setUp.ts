//IT will run before all the tests are run
import "dotenv/config";
import { beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";


beforeAll(async () => {
  const testDbUrl = process.env.MONGODB_URL_TEST;
  if (!testDbUrl) {
    throw new Error("MONGODB_URL_TEST is not defined");
  }
  if (testDbUrl === process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL_TEST must be different from MONGODB_URL");
  }
  await connectDb(testDbUrl);
  
});
// first we will run before all where we will connect to the test database
// Then we will run all the tests
// atlast we will run after all where we will disconnect the test database.
afterAll(async () => {
  await mongoose.disconnect();
});
