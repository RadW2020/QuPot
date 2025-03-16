FROM node:18-alpine as base
WORKDIR /app

FROM base as builder
COPY . .
RUN npm install turbo --global
RUN turbo prune --scope=auth-service --docker

FROM base as installer
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
COPY --from=builder /app/out/full/ .
RUN npm install
COPY turbo.json turbo.json
RUN npm run build --workspace=auth-service

FROM base as runner
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=installer --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=installer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth-service/package.json ./apps/auth-service/package.json
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=installer --chown=nodejs:nodejs /app/packages ./packages

EXPOSE 3003
CMD ["node", "apps/auth-service/dist/apps/auth-service/src/main.js"]