import { serverConfig } from "@repo/config/server";
import { closeDb } from "@repo/db/client";
import { closeRedis } from "@repo/redis/client"; 
import { GracefulShutdownManager } from "./shutdown.js";
import app from "./app.js";
import { roomWss } from "./ws.js";

const shutdown = new GracefulShutdownManager({
    shutdownTimeout: serverConfig.SHUTDOWN_TIMEOUT,
    cleanupTimeout: serverConfig.CLEANUP_TIMEOUT
})

shutdown.registerCleanup("Database", closeDb);
shutdown.registerCleanup("Redis", closeRedis);

const server = app.listen(serverConfig.PORT, () => {
    console.log(`Server running on port ${serverConfig.PORT}`);
})

shutdown.trackConnections(server);

server.on("upgrade", (request, socket, head) => {
    if (!request.url) {
        socket.destroy();
        return;
    }
    
    const { pathname } = new URL(request.url, `http://${request.headers.host}`)

    if(pathname === "/ws/room") {
        roomWss.handleUpgrade(request, socket, head, (ws) => {
            roomWss.emit("connection", ws, request)
        })
    }
    else {
        socket.destroy(); 
    }
})

process.on('SIGTERM', () => shutdown.shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown.shutdown('SIGINT'));
