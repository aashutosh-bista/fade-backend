import request from "supertest";
import { describe, it, expect } from 'vitest';
import app from "../app.js";

describe("GET /health",()=>{
    it('it should return ok when database is connected', async() => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "ok",
        })
    })
})