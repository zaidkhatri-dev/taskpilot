import { config } from "@repo/config";
import { closeDb } from "@repo/db/client";
import { closeRedis } from "@repo/redis/client"; 
import { GracefulShutdownManager } from "./shutdown.js";
import app from "./app.js";

const shutdown = new GracefulShutdownManager({
    shutdownTimeout: config.SHUTDOWN_TIMEOUT,
    cleanupTimeout: config.CLEANUP_TIMEOUT
})

shutdown.registerCleanup("Database", closeDb);
shutdown.registerCleanup("Redis", closeRedis);

const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
})

shutdown.trackConnections(server);

process.on('SIGTERM', () => shutdown.shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown.shutdown('SIGINT'));
