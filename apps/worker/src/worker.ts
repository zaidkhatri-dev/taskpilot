import { Worker, type Job } from 'bullmq';
import { workerConfig } from '@repo/config/worker';
import { sendEmail } from '@repo/email/send';
import { EmailJobData } from "@repo/contracts/other"

const emailWorker = new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
        const { from, to, subject, html } = job.data;

        console.log(`[worker] Processing job ${job.id} — sending email to ${to}`);

        await sendEmail(from, to, subject, html, workerConfig.RESEND_API_KEY);
        
        console.log(`[worker] Job ${job.id} completed`);
    },
    {
        connection: { url: workerConfig.REDIS_URL },
        limiter: {
            max: workerConfig.EMAIL_RATE_LIMIT_PER_MINUTE,
            duration: 1000 * 60,
        },
        concurrency: workerConfig.EMAIL_WORKER_CONCURRENCY,
    }
);

emailWorker.on('completed', (job) => {
    console.log(`[worker] ✓ Job ${job.id} succeeded`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`[worker] ✗ Job ${job?.id} failed:`, err.message);
});

export { emailWorker };
