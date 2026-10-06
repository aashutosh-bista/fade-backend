import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { signUpService, loginService } from "../services/auth.service.js";
import { loginSchema, signUpSchema } from "../validators/auth.validator.js";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signUpSchema.parse(req.body);

  const user = await signUpService(validatedData);
  res.status(201).json(apiResponse("Signed up successfully", user));
});
export const logIn = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await loginService(validatedData);
  res.status(200).json(apiResponse("Logged in successfully", result));
});
