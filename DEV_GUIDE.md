# QuPot Development Guide

This guide explains how to set up and run the QuPot Quantum Lottery Platform services for local development.

## Project Overview

QuPot is a microservices-based quantum lottery platform with the following components:

- **Quantum Service** (Python/FastAPI): Generates quantum random numbers
- **Lottery Service** (NestJS): Manages lottery draws and tickets
- **Blockchain Service** (NestJS/Hardhat): Handles blockchain and smart contract operations
- **Auth Service** (NestJS): Manages authentication and authorization
- **API Gateway** (NestJS): Routes requests to appropriate services

The project uses Turborepo for monorepo management.

## Prerequisites

- **Node.js v18+** and npm
- **Python 3.8+** for the quantum service
- **Docker** and Docker Compose (for containerized development)

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd qupot
npm install
```

2. Run the development environment:

### Run all services

```bash
npm run dev
```

### Run specific services

```bash
# Run just the quantum service
npm run dev -- --filter=quantum-service

# Run multiple specific services
npm run dev -- --filter=quantum-service --filter=api-gateway
```

## Service-Specific Development

### Quantum Service

The quantum service is a Python FastAPI application that generates quantum random numbers.

```bash
# Check environment and dependencies
cd apps/quantum-service
npm run check-env

# Run the quantum service
npm run dev
```

When running, the quantum service will be available at http://localhost:8002

### API Gateway

The API Gateway routes requests to the appropriate microservices.

```bash
cd apps/api-gateway
npm run dev
```

When running, the API Gateway will be available at http://localhost:3000

## Docker Development

You can use Docker Compose to run all services in containers:

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

## Useful Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## Directory Structure

```
qupot/
├── apps/                 # Microservices
│   ├── api-gateway/      # API Gateway service
│   ├── quantum-service/  # Quantum random number service
│   ├── lottery-service/  # Lottery management service
│   ├── blockchain-service/ # Blockchain & smart contract service
│   └── auth-service/     # Authentication service
├── packages/             # Shared libraries
│   └── common-lib/       # Common utilities & types
├── docker/               # Docker configurations
└── docker-compose.yml    # Docker Compose configuration
```

## Service Ports

| Service | Port |
|---------|------|
| API Gateway | 3000 |
| Quantum Service | 8002 |
| Lottery Service | 3001 |
| Blockchain Service | 3002 |
| Auth Service | 3003 |
| PostgreSQL | 5432 |

## Troubleshooting

### Port conflicts

If you encounter a "port already in use" error, you can change the port in the service's package.json file.

### Python environment issues

For the quantum service, run the environment check to verify the Python setup:

```bash
cd apps/quantum-service
npm run check-env
```

### Docker issues

If you encounter Docker issues, try:

```bash
npm run docker:down
docker system prune -a
npm run docker:up
```