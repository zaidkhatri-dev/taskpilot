export interface GracefulShutdownOptions {
    shutdownTimeout?: number;
    cleanupTimeout?: number;
}

export interface CleanupHandler {
    name: string;
    handler: () => Promise<void> | void;
}