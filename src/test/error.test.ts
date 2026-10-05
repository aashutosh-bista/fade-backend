import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Error handling", () => {
  it("it should return Route not found", async () => {
    const response = await request(app).get("/api/not-valid-url");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Route not found",
    });
  });

  it("should return 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/anything")
      .set("Content-Type", "application/json")
      .send("{ bad json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid JSON",
    });
  });

  it("should return 413 when the body is larger than 10kb", async () => {
    const response = await request(app)
      .post("/api/anything")
      .send({ data: "a".repeat(20000) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      success: false,
      message: "Request body too large",
    });
  });
});
