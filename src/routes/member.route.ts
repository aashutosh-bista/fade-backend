import { Router } from "express";
import { createMember, getMembers } from "../controllers/member.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.post("/", createMember);
router.get("/", getMembers);

export default router;