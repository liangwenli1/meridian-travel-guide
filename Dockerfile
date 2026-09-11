FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NITRO_PRESET=node-server
ENV VITE_AUTH_ENABLED=true
# Image build has no Postgres yet — migrate at container start instead.
RUN npm run build:node && npm prune --omit=dev

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/.output ./.output
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts/migrate.mjs ./scripts/migrate.mjs
COPY --from=build /app/scripts/migration-plan.mjs ./scripts/migration-plan.mjs
COPY --from=build /app/scripts/apply-config.mjs ./scripts/apply-config.mjs
COPY --from=build /app/config.json ./config.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
  && useradd --system --uid 1001 --home /app app \
  && chown -R app:app /app

USER app
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
