import { Queue } from "bullmq";
import { Redis as IORedis } from "ioredis";
import { env } from "./env.js";

export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

/**
 * Every accepted lead is enqueued here for the worker to dedupe, score,
 * route and deliver (docs/05-lead-engine.md). The API's job ends at
 * "persisted + enqueued" — it never talks to partners directly.
 */
export const leadProcessingQueue = new Queue("lead-processing", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 5_000 },
    removeOnComplete: 1_000,
    removeOnFail: false,
  },
});

export interface ProcessLeadJob {
  leadId: string;
}
