FROM node:24-bookworm-slim

ENV COREPACK_HOME=/corepack

WORKDIR /workspace

RUN apt-get update \
    && apt-get install --yes --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN corepack enable \
    && corepack prepare "$(node -p "require('./package.json').packageManager")" --activate \
    && pnpm install --frozen-lockfile

COPY . .

RUN chown -R node:node /corepack /workspace

USER node

RUN pnpm --filter @clientflow/api db:generate

WORKDIR /workspace/apps/api

CMD ["node", "--import", "tsx", "src/server.ts"]
