FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY html ./html
COPY postcss.config.mjs tsconfig.json ./
COPY src ./src

RUN pnpm build:production

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=7469

COPY --from=build --chown=node:node /app/dist ./dist

EXPOSE 7469

USER node

CMD ["node", "dist/.index.server.js"]
