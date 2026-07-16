import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  WORKER_CONCURRENCY: z.coerce.number().default(5),
  // Optional: without these, email delivery falls back to a console-log
  // stub (docs/08 phase 1 -> phase 2 gate) so the pipeline still runs
  // end to end before Resend credentials exist.
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("leads@seguro.com.py"),
});

export const env = envSchema.parse(process.env);
