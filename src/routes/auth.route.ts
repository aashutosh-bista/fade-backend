import { logIn } from "../controllers/auth.controller.js";
import { Router } from "express";

import {
  loginLimiter,
} from "../middlewares/rateLimitter.middleware.js";
const router = Router();
router.post("/login", loginLimiter, logIn);
export default router;
