FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

FROM base AS builder
# Copy package files
COPY package.json package-lock.json* turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/package.json
COPY apps/blockchain-service/package.json ./apps/blockchain-service/package.json

# Install dependencies
RUN npm ci

# Copy app source
COPY packages/common-lib ./packages/common-lib
COPY apps/blockchain-service ./apps/blockchain-service

# Build common-lib first, then the blockchain-service
RUN npm run build --workspace=common-lib
RUN npm run build --workspace=blockchain-service

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json* /app/turbo.json ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/blockchain-service ./apps/blockchain-service

RUN npm ci --production

EXPOSE 3002

CMD ["npm", "run", "start", "--workspace=blockchain-service"]