# Use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

# Install CA certificates so HTTPS (Let's Encrypt, etc.) works
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Install dependencies (including devDependencies needed for build)
FROM base AS deps

COPY package.json bun.lock wagmi.config.ts ./

RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/lib/wagmi/generated.ts ./lib/wagmi/generated.ts
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# Production image with standalone output
FROM base AS release

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV EIGENX_RPC_URL=https://0xrpc.io/sep

# Copy Next.js standalone output and static files
# Standalone output includes all necessary dependencies
COPY --from=builder --chown=root:root /usr/src/app/.next/standalone ./
COPY --from=builder --chown=root:root /usr/src/app/.next/static ./.next/static
COPY --from=builder --chown=root:root /usr/src/app/public ./public

USER root

EXPOSE 3000/tcp

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# Bun includes Node.js compatibility, so we can run node server.js
CMD ["node", "server.js"]

