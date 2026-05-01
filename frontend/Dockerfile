# syntax=docker/dockerfile:1.7
#
# AutoMarketer frontend — Vite-built static site served by `serve`.
# Vite inlines env vars at build time, so VITE_* values come in as build args.

# ---------- 1. Build ----------
FROM node:20-bookworm-slim AS build
ARG VITE_API_URL=http://localhost:3000/api/v1
ARG VITE_WEBSOCKET_URL=ws://localhost:3000/ws
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
RUN npm run build

# ---------- 2. Runtime: serve the static dist on :5173 ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g --omit=dev serve@14.2.4 \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 5173

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:5173", "--no-clipboard", "--no-port-switching"]
