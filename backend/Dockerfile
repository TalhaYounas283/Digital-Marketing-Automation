# syntax=docker/dockerfile:1.7
#
# AutoMarketer NestJS backend — production image.
# Multi-stage so the runtime image carries only compiled JS + production deps.

# ---------- 1. Install all deps (dev + prod) ----------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Compile TypeScript -> dist/ ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---------- 3. Prod-only deps (smaller node_modules for runtime) ----------
FROM node:20-bookworm-slim AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- 4. Runtime ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl tini \
    && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build     /app/dist          ./dist
COPY package.json ./

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=4 --start-period=20s \
    CMD curl -fsS http://127.0.0.1:3000/health > /dev/null || exit 1

# tini reaps zombies + forwards signals so SIGTERM cleanly stops Nest.
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/main.js"]
