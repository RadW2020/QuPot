# QuPot - Quantum Lottery Platform

QuPot is a quantum-powered lottery platform that leverages quantum random number generation for provably fair lottery draws. The platform is built using modern microservice architecture and blockchain technology for transparency and security.

## Architecture

The platform consists of multiple microservices:

- **API Gateway**: Central entry point that routes requests to the appropriate services
- **Quantum Service**: Generates quantum random numbers for lottery draws using Qiskit
- **Lottery Service**: Manages lottery draws, tickets, and results
- **Blockchain Service**: Handles blockchain interactions and smart contract operations
- **Auth Service**: Manages user authentication and authorization

## Technology Stack

- **Backend**: NestJS (TypeScript) for most services
- **Quantum Engine**: FastAPI (Python) with Qiskit for quantum computing
- **Database**: PostgreSQL for persistent storage
- **Smart Contracts**: Solidity with Hardhat development environment
- **Infrastructure**: Docker for containerization
- **Build System**: Turborepo for monorepo management

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js v18+
- npm v9+

### Local Development

1. Clone the repository
```
git clone https://github.com/yourusername/qupot.git
cd qupot
```

2. Install dependencies
```
npm install
```

3. Start all services using Docker Compose
```
npm run docker:up
```

4. Access services:
   - API Gateway: http://localhost:3000
   - Quantum Service: http://localhost:8000
   - Lottery Service: http://localhost:3001
   - Blockchain Service: http://localhost:3002
   - Auth Service: http://localhost:3003

5. Stop all services
```
npm run docker:down
```

### Development without Docker

1. Install dependencies
```
npm install
```

2. Start services in development mode
```
npm run dev
```

## Project Structure

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
