FROM node:18-alpine

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

# Build services
RUN npm run build --workspace=common-lib
RUN cd apps/auth-service && nest build

EXPOSE 3003

CMD ["node", "apps/auth-service/dist/main.js"]