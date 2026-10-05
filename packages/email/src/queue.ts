import { Queue } from "bullmq";
import { config } from "@repo/config";

export const emailQueue = new Queue('email', {
    connection: { url: config.REDIS_URL },
    defaultJobOptions: {
        attempts: config.EMAIL_WORKER_MAX_RETRY,
        backoff: {
            type: 'exponential',
            delay: config.EMAIL_WORKER_ATTEMPT_DELAY
        },
        removeOnComplete: true,
        removeOnFail: false
    }
})