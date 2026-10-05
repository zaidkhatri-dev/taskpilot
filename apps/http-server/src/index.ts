import "dotenv/config"
import { config } from "@repo/config";
import express from "express";
import type { Express} from "express";
import { closeDb } from "@repo/db/client";
import { closeRedis } from "@repo/redis/client"; 
import { GracefulShutdownManager } from "./shutdown.js";
import { checkIsServerShuttingDown } from "@middlewares/graceful-shutdown.js";
import { globalErrorHandler } from "@middlewares/global-error.js";

const shutdown = new GracefulShutdownManager({
    shutdownTimeout: config.SHUTDOWN_TIMEOUT,
    cleanupTimeout: config.CLEANUP_TIMEOUT
})

const app: Express = express()

app.use(checkIsServerShuttingDown)
app.use()

app.use(globalErrorHandler)

shutdown.registerCleanup("Database", closeDb);
shutdown.registerCleanup("Redis", closeRedis);

const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
})

shutdown.trackConnections(server);

process.on('SIGTERM', () => shutdown.shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown.shutdown('SIGINT'));
