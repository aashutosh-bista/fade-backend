import { Request, Response } from "express";
import mongoose from "mongoose";
export function healthCheckUp(req: Request, res: Response) {
  const dbConnection = mongoose.connection.readyState === 1;
  res.status(dbConnection ? 200 : 503).json({
    status: dbConnection ? "ok" : "unavailable",
  });
}
