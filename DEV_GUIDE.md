# QuPot Development Guide

This guide explains how to set up and run the QuPot Quantum Lottery Platform services for local development.

## Project Overview

QuPot is a microservices-based quantum lottery platform that uses quantum random number generation for provably fair lottery draws. The platform consists of the following components:

- **Quantum Service** (Python/FastAPI): Generates quantum random numbers using Qiskit
- **Lottery Service** (NestJS): Manages lottery draws, tickets, and results
- **Blockchain Service** (NestJS/Hardhat): Handles blockchain interactions and smart contract operations
- **Auth Service** (NestJS): Manages user authentication and authorization
- **API Gateway** (NestJS): Routes requests to appropriate services

The project uses Turborepo for monorepo management and dependency orchestration.

## Prerequisites

- **Node.js v18+** and npm
- **Python 3.8+** for the quantum service
- **Docker** and Docker Compose (optional, for containerized development)

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd qupot
npm install
```

2. Run the development environment:

### Run All Services

To start all services in development mode:

```bash
npm run dev
```

This command uses Turborepo to run all services in parallel, respecting dependencies between them.

### Run Specific Services

To run only specific services:

```bash
# Run just the quantum service
npm run dev -- --filter=quantum-service

# Run multiple specific services
npm run dev -- --filter=quantum-service --filter=api-gateway
```

## Service-Specific Development

### Quantum Service

The Quantum Service is a Python FastAPI application that generates random numbers using quantum computing principles.

```bash
# Navigate to the quantum service directory
cd apps/quantum-service

# Check environment and dependencies
npm run check-env

# Run the quantum service in development mode
npm run dev
```

When running, the Quantum Service will be available at http://localhost:8002 with:

- Interactive API documentation at http://localhost:8002/docs
- Custom HTML documentation at http://localhost:8002/

#### Key Quantum Service Files

- `src/main.py`: Main FastAPI application with endpoints
- `scripts/check_env.py`: Environment verification script
- `client.py`: API testing client
- `visualize_circuit.py`: Quantum circuit visualization generator

### API Gateway

The API Gateway routes requests to the appropriate microservices and provides a unified API.

```bash
cd apps/api-gateway
npm run dev
```

When running, the API Gateway will be available at http://localhost:8000

## Docker Development

You can use Docker Compose to run all services in containers:

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

Docker development is especially useful for:

- Testing the entire system integration
- Ensuring consistent environments across developer machines
- Running services that require specific dependencies

## Development Workflows

### Adding a New Feature to Quantum Service

1. Navigate to the quantum service directory:

   ```bash
   cd apps/quantum-service
   ```

2. Activate the virtual environment:

   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Implement your feature in `src/main.py` or create new modules as needed

4. Test your implementation:

   ```bash
   python client.py
   ```

5. Run the service to verify your changes:
   ```bash
   npm run dev
   ```

### Running Tests

Each service has its own testing configuration:

```bash
# Run tests for all services
npm run test

# Run tests for a specific service
npm run test -- --filter=quantum-service
```

### Code Quality

Maintain code quality with linting and formatting:

```bash
# Run linting for all services
npm run lint

# Format code
npm run format
```

## Directory Structure

```
qupot/
├── apps/                 # Microservices
│   ├── api-gateway/      # API Gateway service (NestJS)
│   ├── quantum-service/  # Quantum random number service (FastAPI/Python)
│   │   ├── src/          # Service source code
│   │   ├── scripts/      # Utility scripts
│   │   └── venv/         # Python virtual environment (git-ignored)
│   ├── lottery-service/  # Lottery management service (NestJS)
│   ├── blockchain-service/ # Blockchain & smart contract service (NestJS/Solidity)
│   └── auth-service/     # Authentication service (NestJS)
├── packages/             # Shared libraries
│   └── common-lib/       # Common utilities & types (TypeScript)
├── docker/               # Docker configurations
└── docker-compose.yml    # Docker Compose configuration
```

## Service Ports

| Service            | Port | Technologies            |
| ------------------ | ---- | ----------------------- |
| API Gateway        | 8000 | NestJS                  |
| Auth Service       | 8001 | NestJS/JWT              |
| Quantum Service    | 8002 | FastAPI/Python/Qiskit   |
| Lottery Service    | 8003 | NestJS/PostgreSQL       |
| Blockchain Service | 8004 | NestJS/Hardhat/Solidity |
| PostgreSQL         | 5432 | PostgreSQL              |

## Troubleshooting

### Port Conflicts

If you encounter a "port already in use" error:

1. Check which process is using the port:

   ```bash
   # On macOS/Linux
   lsof -i :<port>

   # On Windows
   netstat -ano | findstr :<port>
   ```

2. Either kill the existing process or change the port in the service's package.json file:
   ```json
   "dev": "if [ ! -d \"venv\" ]; then npm run setup; fi && . venv/bin/activate && uvicorn src.main:app --reload --host 0.0.0.0 --port 8002"
   ```

### Python Environment Issues

For the Quantum Service, run the environment check to verify the Python setup:

```bash
cd apps/quantum-service
npm run check-env
```

Common issues include:

- Missing Python dependencies
- Incorrect Python version
- Virtual environment not activated

### Docker Issues

If you encounter Docker issues, try:

```bash
# Stop and remove all containers
npm run docker:down

# Clean up Docker resources
docker system prune -a

# Restart services
npm run docker:up
```

### Handling Node.js Dependencies

If you encounter Node.js dependency issues:

```bash
# Clean npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Additional Resources

- [Quantum Service README](./apps/quantum-service/README.md): Detailed documentation for the Quantum Service
- [SETUP_SUMMARY.md](./SETUP_SUMMARY.md): Summary of the current setup
- [QUANTUM_CONCEPTS.md](./docs/QUANTUM_CONCEPTS.md): Explanation of quantum computing principles used
- [FastAPI Documentation](https://fastapi.tiangolo.com/): Documentation for FastAPI
- [Qiskit Documentation](https://qiskit.org/documentation/): Documentation for Qiskit
- [IBM Quantum](https://quantum-computing.ibm.com/): IBM's quantum computing platform
- [Turborepo Documentation](https://turbo.build/repo/docs): Documentation for Turborepo
