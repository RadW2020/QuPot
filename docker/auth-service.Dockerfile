FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/
COPY apps/auth-service/package.json ./apps/auth-service/

# Install dependencies
RUN npm install
RUN npm install @nestjs/cli --global

# Copy source code
COPY packages/common-lib ./packages/common-lib
COPY apps/auth-service ./apps/auth-service

# Build common-lib first
RUN cd packages/common-lib && npm run build
# Then build auth-service
RUN cd apps/auth-service && nest build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/
COPY apps/auth-service/package.json ./apps/auth-service/

RUN npm install --production

# Copy the built files
COPY --from=builder /app/packages/common-lib/dist ./packages/common-lib/dist
COPY --from=builder /app/packages/common-lib/src ./packages/common-lib/src
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist

EXPOSE 8001

CMD ["node", "apps/auth-service/dist/main.js"]