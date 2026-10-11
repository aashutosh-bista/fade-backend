import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import { Member } from "../models/member.model.js";
import { User } from "../models/user.model.js";
import { signToken } from "../utils/token.js";

let adminToken = "";
let userToken = "";

beforeAll(async () => {
  await Member.init();
  await User.init();
});

beforeEach(async () => {
  await Member.deleteMany({});
  await User.deleteMany({});
  const admin = await User.create({ name: "Admin", email: "admin@test.com", passwordHash: "x", role: "admin" });
  const user = await User.create({ name: "User", email: "user@test.com", passwordHash: "x" });
  adminToken = signToken(admin.id, "admin");
  userToken = signToken(user.id, "user");
});

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe("Members", () => {
  it("rejects requests without a token (401)", async () => {
    const res = await request(app).post("/api/members").send({});
    expect(res.status).toBe(401);
  });

  it("rejects a non-admin (403)", async () => {
    const res = await request(app)
      .post("/api/members")
      .set(auth(userToken))
      .send({ name: "Ram", number: "9812345678" });
    expect(res.status).toBe(403);
  });

  it("creates a member and normalizes the number (201)", async () => {
    const res = await request(app)
      .post("/api/members")
      .set(auth(adminToken))
      .send({ name: "Ram", number: "+977 98-12345678", email: "" });
    expect(res.status).toBe(201);
    expect(res.body.data.number).toBe("9812345678");
    expect(res.body.data.email).toBeUndefined();
  });

  it("allows two members without an email", async () => {
    const a = await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Ram", number: "9812345678" });
    const b = await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Sita", number: "9812345679" });
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
  });

  it("rejects an invalid number (400)", async () => {
    const res = await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Ram", number: "12345" });
    expect(res.status).toBe(400);
  });

  it("rejects a duplicate number (409)", async () => {
    await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Ram", number: "9812345678" });
    const res = await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Sita", number: "9812345678" });
    expect(res.status).toBe(409);
  });

  it("lists members for an admin (200)", async () => {
    await request(app).post("/api/members").set(auth(adminToken)).send({ name: "Ram", number: "9812345678" });
    const res = await request(app).get("/api/members").set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.total).toBe(1);
  });
});