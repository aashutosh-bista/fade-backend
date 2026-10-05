import { NextFunction, Request, Response } from "express";
import {  ZodError } from "zod";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //zod validation error handeling
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: error.issues.map((issue) => {
        return {
          field: String(issue.path[0]),
          message: issue.message,
        };
      }),
    });
  }
  //custom api error handeling
  if (error instanceof ApiError) {
    return res.status(error.statusCode || 500).json({
      success: error.success,
      message: error.message,
    });
  }
  //mongoose duplicate value error handeling
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "keyPattern" in error
  ) {
    if (error.code === 11000) {
      if (typeof error.keyPattern === "object" && error.keyPattern !== null) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({
          success: false,
          message: "Duplicate value error",
          errors: [
            {
              field: field,
              message: `${field} already exists`,
            },
          ],
        });
      }
    }
  }
  //mongoose validation error handeling
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "errors" in error &&
    error.name === "ValidationError"
  ) {
    if (typeof error.errors === "object" && error.errors !== null) {
      const validationErrors = error.errors as Record<
        string,
        mongoose.Error.ValidatorError
      >;

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: Object.keys(validationErrors).map((field) => {
          return {
            field: field,
            message: validationErrors[field].message,
          };
        }),
      });
    }
  }
  //errors from express.json(): bad json or body too large
  if (typeof error === "object" && error !== null && "type" in error) {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON",
      });
    }
    if (error.type === "entity.too.large") {
      return res
        .status(413)
        .json({ success: false, message: "Request body too large" });
    }
  }

  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    error,
  );
  return res.status(500).json({
    success: false,
    message: "Server Issue",
  });
};
