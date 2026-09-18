import "dotenv/config"
import { config } from "@repo/config";
import express from "express";
import type { Express, Request, Response, NextFunction} from "express";
import { closeDb } from "@repo/db/client";
import { closeRedis } from "@repo/redis/client"; 
import type { HttpResponse } from "@repo/contracts/http";
import { GracefulShutdownManager } from "./shutdown.js";

const shutdown = new GracefulShutdownManager({
    shutdownTimeout: config.SHUTDOWN_TIMEOUT,
    cleanupTimeout: config.CLEANUP_TIMEOUT
})

const app: Express = express()

app.use((req: Request, res: Response, next: NextFunction) => {
    if(shutdown.isTerminating()){
        const response: HttpResponse<null> = {
            success: false,
            message: "Server is shutting down",
            data: null
        }
        
        return res.status(503).json(response);
    }

    next()
})

shutdown.registerCleanup("Database", closeDb);
shutdown.registerCleanup("Redis", closeRedis);

const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
})

shutdown.trackConnections(server);

process.on('SIGTERM', () => shutdown.shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown.shutdown('SIGINT'));
