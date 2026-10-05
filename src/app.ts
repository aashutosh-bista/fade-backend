import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter } from "./middlewares/rateLimitter.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import healthRoutes from "./routes/health.route.js";
const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.PRODUCTION_CORS || "http://localhost:1000",
  }),
);
app.use(helmet());
app.use('/health',healthRoutes)
app.use(apiLimiter);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(errorMiddleware);
export default app;
