# Quantum Service for QuPot

The Quantum Service is a FastAPI-based microservice that provides quantum random number generation for the QuPot Quantum Lottery Platform. It uses quantum computing principles through Qiskit to deliver truly random numbers for lottery draws.

## Features

- Generates truly random numbers using quantum computing principles
- Uses Qiskit to simulate quantum circuits
- Provides REST API for quantum random number generation
- Offers information and visualization of the quantum circuits used
- Includes comprehensive documentation and testing tools

## Installation

### Prerequisites

- Python 3.8+
- Node.js v18+ (for running with Turborepo)
- Virtual environment (recommended)

### Option 1: Setup with npm (Recommended)

The service is configured to be run as part of the QuPot monorepo using Turborepo:

```bash
# From the quantum-service directory
npm run setup    # Creates virtual env and installs dependencies
npm run dev      # Starts the service

# Alternatively, from the root directory
npm run dev -- --filter=quantum-service
```

### Option 2: Manual Setup

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the service:

```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 8002 --reload
```

## Dependencies

The service requires the following main dependencies with minimum versions:

- fastapi >= 0.115.0
- uvicorn >= 0.24.0
- pydantic >= 2.0.0
- qiskit >= 1.0.0
- qiskit-aer >= 0.13.0
- qiskit-ibm-runtime >= 0.18.0
- pytest >= 8.0.0
- httpx >= 0.24.0
- python-dotenv >= 1.0.0

## API Endpoints

### Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "quantum-random-number-generator"
  }
  ```

### Generate Random Numbers

- **URL**: `/api/v1/random`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "min_value": 1,
    "max_value": 90,
    "count": 6,
    "unique": true
  }
  ```
- **Response**:
  ```json
  {
    "numbers": [23, 45, 12, 67, 89, 34],
    "source": "quantum_simulator",
    "timestamp": "2025-03-15T12:34:56.789012",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

### Get Quantum Circuit Info

- **URL**: `/api/v1/quantum-circuit`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "circuit_description": "Hadamard gate followed by measurement",
    "circuit_qubits": 1,
    "circuit_depth": 2,
    "measurement_counts": { "0": 500, "1": 500 },
    "explanation": "This quantum circuit places a qubit in superposition using a Hadamard gate, creating an equal probability of measuring 0 or 1. The measurement then collapses the superposition, providing a truly random bit."
  }
  ```

## Interactive Documentation

The service provides an interactive Swagger UI documentation at `/docs` when running. This allows you to:

- Explore available endpoints
- Try out API requests directly in the browser
- View detailed request and response schemas

Additionally, a custom HTML documentation page is available at the root URL (`/`).

## Testing

### Running Tests

```bash
# Activate virtual environment
source venv/bin/activate

# Run tests
python -m pytest tests/ -v
```

### Test Coverage

The service includes tests for:

- Health check endpoint
- Random number generation with various parameters
- Quantum circuit information endpoint
- Error handling and validation

## Quantum Theory Background

The random number generation in this service uses the fundamental quantum principle of superposition. When a qubit is placed in superposition using a Hadamard gate, it has an equal probability of being measured as either 0 or 1. This measurement process is truly random according to the laws of quantum mechanics, not just pseudorandom like classical algorithms.

Unlike traditional random number generators that use deterministic algorithms, quantum random number generation leverages quantum mechanical phenomena to produce truly unpredictable results, which is ideal for fair lottery applications.

## Known Issues and Future Updates

### Deprecation Warnings

The service currently uses some deprecated Qiskit features that will be updated in future versions:

- `BackendSampler` will be replaced with `BackendSamplerV2`
- Some DAGCircuit properties will be updated to their new versions
- The `condition` property of `Instruction` will be updated

These updates will be implemented in future versions to ensure compatibility with the latest Qiskit releases.

## Docker Support

The service can be run in a Docker container using the provided Dockerfile:

```bash
# From the root directory
docker build -t quantum-service -f ./docker/quantum-service.Dockerfile .
docker run -p 8002:8002 quantum-service

# Or using Docker Compose
npm run docker:up
```

## Integration with Other Services

This service is designed to integrate with the other microservices in the QuPot platform:

- The API Gateway forwards requests to this service
- The Lottery Service uses this service to generate random numbers for draws
