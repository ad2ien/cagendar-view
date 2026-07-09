FROM node:26.5.0-trixie-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY config.dummy.json ./config.json
RUN npm install -g yarn && yarn --frozen-lockfile

COPY . .
RUN npm install -g yarn && yarn next telemetry disable
RUN npm install -g yarn && yarn build

FROM node:26.5.0-alpine3.24 AS runner

WORKDIR /app

ENV NODE_ENV=production

# Standalone output includes a minimal server + production node_modules
COPY --from=builder /app/.next/standalone ./
# Static assets need to be copied separately for standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3083

CMD ["node", "server.js"]
