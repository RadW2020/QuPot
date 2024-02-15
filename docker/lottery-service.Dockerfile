FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/
COPY apps/lottery-service/package.json ./apps/lottery-service/

# Install dependencies
RUN npm install
RUN npm install @nestjs/cli --global

# Copy source code
COPY packages/common-lib ./packages/common-lib
COPY apps/lottery-service ./apps/lottery-service

# Build services
RUN npm run build --workspace=common-lib
RUN npm run build --workspace=lottery-service

EXPOSE 8003

CMD ["node", "apps/lottery-service/dist/main.js"]