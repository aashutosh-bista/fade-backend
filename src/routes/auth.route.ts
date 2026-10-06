import { logIn, signUp } from "../controllers/auth.controller.js";
import { Router } from "express";
import {
  loginLimiter,
  signupLimiter,
} from "../middlewares/rateLimitter.middleware.js";
const router = Router();

router.post("/signup", signupLimiter, signUp);
router.post("/login", loginLimiter, logIn);
export default router;
