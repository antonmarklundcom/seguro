# Build from the monorepo root: docker build -f apps/worker/Dockerfile .
# Works as-is on Railway or Fly.io (both build directly from a Dockerfile).
FROM node:22-slim AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seguro/db generate
RUN pnpm --filter "@seguro/worker..." run build

# Copies the whole built monorepo (simple, correct, not size-optimized).
# For a slimmer image later, replace with `pnpm --filter @seguro/worker
# deploy --prod /app` and copy only /app into this stage.
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo /repo
WORKDIR /repo/apps/worker
CMD ["node", "dist/index.js"]
