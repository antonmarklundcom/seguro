import { Queue } from "bullmq";
import { Redis as IORedis } from "ioredis";

let queue: Queue | undefined;

/** Same queue apps/worker consumes (apps/api/src/lib/queue.ts) — used here
 * only for manual redeliver from the lead detail page (docs/05 admin).
 * Lazily created on first use so `next build`'s static page-data
 * collection never tries to open a Redis connection at import time. */
export function getLeadProcessingQueue(): Queue {
  if (!queue) {
    const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    queue = new Queue("lead-processing", { connection });
  }
  return queue;
}
