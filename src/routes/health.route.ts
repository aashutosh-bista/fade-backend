import { Router } from "express";
import { healthCheckUp } from "../controllers/health.controller.js";

const routes = Router();

routes.get('/', healthCheckUp);

export default routes;