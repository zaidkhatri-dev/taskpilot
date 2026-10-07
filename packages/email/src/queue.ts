import { Queue } from "bullmq";

let emailQueue: Queue | null = null;

export const getEmailQueue = (options?: { redisUrl: string, maxRetries: number, attemptDelay: number }) => {
    if (!emailQueue) {
        if (!options) throw new Error("Options required for initialization");
        emailQueue = new Queue('email', {
            connection: { url: options.redisUrl },
            defaultJobOptions: {
                attempts: options.maxRetries,
                backoff: {
                    type: 'exponential',
                    delay: options.attemptDelay
                },
                removeOnComplete: true,
                removeOnFail: false
            }
        });
    }
    return emailQueue!;
};