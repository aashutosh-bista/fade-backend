import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { setupGracefulShutdown } from "./utils/shutdown.js";

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
const PORT = process.env.PORT || "3000";

async function startServer() {
  await connectDb();
  const server = app.listen(PORT, () => {
    console.log(`Backend running on ${PORT}`);
  });
  setupGracefulShutdown(server);
}
startServer();
