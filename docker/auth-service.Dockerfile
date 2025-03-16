FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

FROM base AS builder
# Copy package files
COPY package.json package-lock.json* turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/package.json
COPY apps/auth-service/package.json ./apps/auth-service/package.json

# Install dependencies
RUN npm ci

# Copy app source
COPY packages/common-lib ./packages/common-lib
COPY apps/auth-service ./apps/auth-service

# Build common-lib first, then the auth-service
RUN npm run build --workspace=common-lib
RUN npm run build --workspace=auth-service

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json* /app/turbo.json ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/auth-service ./apps/auth-service

RUN npm ci --production

EXPOSE 3003

CMD ["npm", "run", "start", "--workspace=auth-service"]