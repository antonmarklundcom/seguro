import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { env } from "./lib/env.js";
import { healthRoutes } from "./routes/health.js";
import { leadsRoutes } from "./routes/leads.js";
import { partnerRoutes } from "./routes/partner.js";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    transport: env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
  },
});

await app.register(cors, { origin: env.CORS_ORIGIN });
await app.register(rateLimit, { max: 20, timeWindow: "1 minute" });

await app.register(healthRoutes);
await app.register(leadsRoutes);
await app.register(partnerRoutes);

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`api listening on :${env.PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
