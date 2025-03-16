FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/
COPY apps/api-gateway/package.json ./apps/api-gateway/

# Install dependencies
RUN npm install
RUN npm install @nestjs/cli --global

# Copy source code
COPY packages/common-lib ./packages/common-lib
COPY apps/api-gateway ./apps/api-gateway

# Build services
RUN npm run build --workspace=common-lib
RUN npm run build --workspace=api-gateway

EXPOSE 8000

CMD ["node", "apps/api-gateway/dist/main.js"]