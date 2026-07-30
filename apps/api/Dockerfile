FROM node:24-bookworm-slim

ENV COREPACK_HOME=/corepack

WORKDIR /workspace

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

CMD ["pnpm", "--filter", "@clientflow/api", "dev"]
