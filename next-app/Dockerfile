# Use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

WORKDIR /usr/src/app

# Install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev

COPY package.json bun.lock /temp/dev/

RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod

COPY package.json bun.lock /temp/prod/

RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease

COPY --from=install /temp/dev/node_modules node_modules

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js app
RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy production node_modules (not needed for standalone, but kept for consistency)
COPY --from=install /temp/prod/node_modules node_modules

# Copy Next.js standalone output and static files
COPY --from=prerelease /usr/src/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown -R bun:bun .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=prerelease --chown=bun:bun /usr/src/app/.next/standalone ./
COPY --from=prerelease --chown=bun:bun /usr/src/app/.next/static ./.next/static

USER bun

EXPOSE 3000/tcp

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# Bun includes Node.js compatibility, so we can run node server.js
CMD ["node", "server.js"]

