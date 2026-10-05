import { Worker, type Job } from 'bullmq';
import { config } from '@repo/config';
import { sendEmail } from '@repo/email/send';
import { EmailJobData } from "@repo/contracts/other"

const emailWorker = new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
        const { from, to, subject, html } = job.data;

        console.log(`[worker] Processing job ${job.id} — sending email to ${to}`);

        await sendEmail(from, to, subject, html);
        
        console.log(`[worker] Job ${job.id} completed`);
    },
    {
        connection: { url: config.REDIS_URL },
        limiter: {
            max: config.EMAIL_RATE_LIMIT_PER_MINUTE,
            duration: 1000 * 60,
        },
        concurrency: config.EMAIL_WORKER_CONCURRENCY,
    }
);

emailWorker.on('completed', (job) => {
    console.log(`[worker] ✓ Job ${job.id} succeeded`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`[worker] ✗ Job ${job?.id} failed:`, err.message);
});

export { emailWorker };
