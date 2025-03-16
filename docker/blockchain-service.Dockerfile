FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY packages/common-lib/package.json ./packages/common-lib/
COPY apps/blockchain-service/package.json ./apps/blockchain-service/

# Install dependencies
RUN npm install
RUN npm install @nestjs/cli --global

# Copy source code
COPY packages/common-lib ./packages/common-lib
COPY apps/blockchain-service ./apps/blockchain-service

# Build services
RUN npm run build --workspace=common-lib
RUN cd apps/blockchain-service && nest build

EXPOSE 8004

CMD ["node", "apps/blockchain-service/dist/src/main.js"]