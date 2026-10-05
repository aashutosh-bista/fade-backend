import mongoose from "mongoose";
import type { Server } from "http";

export function setupGracefulShutdown(server: Server) {
  let isShuttingDown = false;

  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`${signal} received, shutting down...`);

    setTimeout(() => {
      console.log("Shutdown timed out, forcing exit");
      process.exit(1);
    }, 10_000).unref();

    server.close(async () => {
      try {
        await mongoose.disconnect();
        console.log("MongoDb connection closed");
        process.exit(0);
      } catch (error) {
        console.log("Error while closing MongoDb connection:", error);
        process.exit(1);
      }
    });
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
