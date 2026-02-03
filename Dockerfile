FROM node:25.2.1-trixie-slim AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY config.dummy.json ./config.json

RUN yarn

COPY . .

RUN yarn next telemetry disable
RUN yarn build

FROM node:25.2.1-trixie-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3083

CMD ["yarn", "start", "-p", "3083"]
