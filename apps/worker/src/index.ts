import { emailWorker } from './worker.js';

console.log('[worker] Starting email worker...');

const shutdown = async (signal: string) => {
    console.log(`\n[worker] Received ${signal}. Closing worker gracefully...`);
    await emailWorker.close();
    console.log('[worker] Worker closed. Exiting.');
    process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
