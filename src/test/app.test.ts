import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
  it("should return backend running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Backend is running",
    });
  });
});