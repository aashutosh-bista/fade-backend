import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import { Booking, BRANCHES } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import { SLOT_CONFIG, generateSlotTimes } from "../config/slots.js";
import { addDays, getNepalDateString } from "../utils/nepalTime.js";
import { signToken } from "../utils/token.js";

const branch = BRANCHES[0];
const tomorrow = addDays(getNepalDateString(), 1);
const firstTime = generateSlotTimes()[0]!;

const payload = (over: Record<string, unknown> = {}) => ({
  name: "Ram",
  number: "9812345678",
  branch,
  date: tomorrow,
  time: firstTime,
  ...over,
});

let adminToken = "";

beforeAll(async () => {
  await Booking.init(); // builds the partial unique index
  await User.init();
});

beforeEach(async () => {
  await Booking.deleteMany({});
  await User.deleteMany({});
  const admin = await User.create({ name: "Admin", email: "admin@test.com", passwordHash: "x", role: "admin" });
  adminToken = signToken(admin.id, "admin");
});

describe("Bookings", () => {
  it("lists all slots as available for an empty day", async () => {
    const res = await request(app).get(`/api/bookings/slots?branch=${branch}&date=${tomorrow}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(generateSlotTimes().length);
    expect(res.body.data.every((s: { available: boolean }) => s.available)).toBe(true);
  });

  it("creates a booking (201) and marks the slot unavailable", async () => {
    const res = await request(app).post("/api/bookings").send(payload());
    expect(res.status).toBe(201);

    const slots = await request(app).get(`/api/bookings/slots?branch=${branch}&date=${tomorrow}`);
    const slot = slots.body.data.find((s: { time: string }) => s.time === firstTime);
    expect(slot.available).toBe(false);
  });

  it("rejects a double booking (409)", async () => {
    await request(app).post("/api/bookings").send(payload());
    const res = await request(app).post("/api/bookings").send(payload({ name: "Sita", number: "9812345679" }));
    expect(res.status).toBe(409);
  });

  it("rejects an invalid time slot (400)", async () => {
    const res = await request(app).post("/api/bookings").send(payload({ time: "10:17" }));
    expect(res.status).toBe(400);
  });

  it("rejects a past date (400)", async () => {
    const res = await request(app).post("/api/bookings").send(payload({ date: "2020-01-01" }));
    expect(res.status).toBe(400);
  });

  it("rejects a date too far ahead (400)", async () => {
    const far = addDays(getNepalDateString(), SLOT_CONFIG.maxDaysAhead + 1);
    const res = await request(app).post("/api/bookings").send(payload({ date: far }));
    expect(res.status).toBe(400);
  });

  it("rejects an unknown branch (400)", async () => {
    const res = await request(app).post("/api/bookings").send(payload({ branch: "nowhere" }));
    expect(res.status).toBe(400);
  });

  it("blocks the admin list without a token (401)", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });

  it("lets an admin list bookings (200)", async () => {
    await request(app).post("/api/bookings").send(payload());
    const res = await request(app).get("/api/bookings").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  it("cancels a booking and frees the slot for rebooking", async () => {
    const created = await request(app).post("/api/bookings").send(payload());
    const id = created.body.data._id;

    const cancelled = await request(app)
      .patch(`/api/bookings/${id}/cancel`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.data.status).toBe("cancelled");

    const rebooked = await request(app).post("/api/bookings").send(payload({ name: "Sita", number: "9812345679" }));
    expect(rebooked.status).toBe(201);
  });
});