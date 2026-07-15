import { Worker } from "bullmq";
import { Redis as IORedis } from "ioredis";
import pino from "pino";
import { env } from "./lib/env.js";
import { processLead } from "./process-lead.js";

const logger = pino({ level: env.NODE_ENV === "production" ? "info" : "debug" });

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

const worker = new Worker("lead-processing", processLead, {
  connection,
  concurrency: env.WORKER_CONCURRENCY,
});

worker.on("completed", (job) => {
  logger.info({ jobId: job.id, leadId: job.data.leadId }, "lead processed");
});

worker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, leadId: job?.data?.leadId, attempts: job?.attemptsMade, err },
    "lead processing failed",
  );
});

logger.info("worker started, waiting for jobs");

process.on("SIGTERM", async () => {
  await worker.close();
  process.exit(0);
});
