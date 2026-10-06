import type { Server } from "http";
import type { Socket } from "node:net";
import type { GracefulShutdownOptions, CleanupHandler } from "./types/graceful-shutdown.js";

// TODO: add graceful shutdown for websocket server
export class GracefulShutdownManager {
    private shutdownTimeout: number;
    private cleanupTimeout: number;
    private isShuttingDown = false;
    private connections = new Set<Socket>();
    private cleanupHandlers: CleanupHandler[] = [];
    private server: Server | null = null;

    constructor(options: GracefulShutdownOptions = {}) {
        this.shutdownTimeout = options.shutdownTimeout ?? 30_000;
        this.cleanupTimeout = options.cleanupTimeout ?? 5_000;
    }

    /**
     * Register resources that need cleanup.
     */
    registerCleanup(
        name: string,
        handler: () => Promise<void> | void,
    ): void {
        this.cleanupHandlers.push({
            name,
            handler,
        });
    }

    /**
     * Track HTTP connections.
     */
    trackConnections(server: Server): void {
        this.server = server;

        server.on("connection", (socket: Socket) => {
            this.connections.add(socket);

            socket.on("close", () => {
                this.connections.delete(socket);
            });
        });
    }

    /**
     * Stop the HTTP server from accepting new connections.
     */
    private closeServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                resolve();
                return;
            }

            this.server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Check if the application is shutting down.
     */
    isTerminating(): boolean {
        return this.isShuttingDown;
    }

    /**
     * Main shutdown handler.
     */
    async shutdown(signal: string): Promise<void> {
        if (this.isShuttingDown) {
            console.log("Shutdown already in progress");
            return;
        }

        console.log(`\n[Shutdown] Received ${signal}`);

        this.isShuttingDown = true;

        const startTime = Date.now();

        /**
         * Set up force shutdown timeout.
         */
        const forceShutdownTimer = setTimeout(() => {
            console.error(
                "[Shutdown] Timeout exceeded, forcing exit",
            );

            process.exit(1);
        }, this.shutdownTimeout);

        try {
            /**
             * Step 1: Stop accepting new connections.
             */
            console.log("[Shutdown] Stopping HTTP server...");

            await this.closeServer();

            console.log("[Shutdown] HTTP server stopped");

            /**
             * Step 2: Run cleanup handlers in reverse order.
             */
            for (
                let i = this.cleanupHandlers.length - 1;
                i >= 0;
                i--
            ) {
                const { name, handler } = this.cleanupHandlers[i]!;

                console.log(
                    `[Shutdown] Cleaning up: ${name}...`,
                );

                try {
                    await Promise.race([
                        Promise.resolve(handler()),
                        new Promise<never>((_, reject) => {
                            setTimeout(
                                () =>
                                    reject(
                                        new Error(
                                            "Cleanup timeout",
                                        ),
                                    ),
                                this.cleanupTimeout,
                            );
                        }),
                    ]);

                    console.log(
                        `[Shutdown] ${name} cleaned up`,
                    );
                } catch (error) {
                    console.error(
                        `[Shutdown] Error cleaning up ${name}:`,
                        error instanceof Error
                            ? error.message
                            : error,
                    );
                }
            }

            /**
             * Step 3: Close remaining connections.
             */
            if (this.connections.size > 0) {
                console.log(
                    `[Shutdown] Closing ${this.connections.size} remaining connections`,
                );

                for (const socket of this.connections) {
                    socket.destroy();
                }
            }

            const duration = Date.now() - startTime;

            console.log(
                `[Shutdown] Completed in ${duration}ms`,
            );

            clearTimeout(forceShutdownTimer);

            process.exit(0);
        } catch (error) {
            console.error(
                "[Shutdown] Error during shutdown:",
                error,
            );

            clearTimeout(forceShutdownTimer);

            process.exit(1);
        }
    }
}