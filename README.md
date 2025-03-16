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

- Node.js v18+
- npm v9+
- Python 3.8+ (for Quantum Service)
- Docker and Docker Compose (optional, for containerized development)

### Option 1: Development with Turborepo

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd qupot
npm install
```

2. Run services using Turborepo:
```bash
# Run all services
npm run dev

# Run only the quantum service
npm run dev -- --filter=quantum-service
```

3. Access services:
   - API Gateway: http://localhost:8000
   - Auth Service: http://localhost:8001
   - Quantum Service: http://localhost:8002
   - Lottery Service: http://localhost:8003
   - Blockchain Service: http://localhost:8004

### Option 2: Development with Docker

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd qupot
npm install
```

2. Start all services using Docker Compose:
```bash
npm run docker:up
```

3. Stop all services:
```bash
npm run docker:down
```

## Project Structure

```
qupot/
├── apps/                 # Microservices
│   ├── api-gateway/      # API Gateway service (NestJS)
│   ├── quantum-service/  # Quantum random number service (FastAPI/Python)
│   ├── lottery-service/  # Lottery management service (NestJS)
│   ├── blockchain-service/ # Blockchain & smart contract service (NestJS/Solidity)
│   └── auth-service/     # Authentication service (NestJS)
├── packages/             # Shared libraries
│   └── common-lib/       # Common utilities & types (TypeScript)
├── docker/               # Docker configurations
└── docker-compose.yml    # Docker Compose configuration
```

## Documentation

- **[DEV_GUIDE.md](./DEV_GUIDE.md)**: Detailed development instructions
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)**: Summary of the current setup
- **[QUANTUM_CONCEPTS.md](./docs/QUANTUM_CONCEPTS.md)**: Explanation of quantum computing principles used
- **Service README files**: Each service contains its own documentation

## Current Focus

The project is currently focused on developing the **Quantum Service**, which provides quantum random number generation through a REST API using Qiskit and quantum computing principles. This service leverages quantum superposition and measurement to generate truly random numbers that are cryptographically secure and unpredictable, making them ideal for fair lottery draws.
