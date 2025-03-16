# Quantum Service for QuPot

The Quantum Service is a FastAPI-based microservice that provides quantum random number generation for the QuPot Quantum Lottery Platform.

## Features

- Generates truly random numbers using quantum computing principles
- Uses Qiskit to simulate quantum circuits
- Provides REST API for quantum random number generation
- Offers information about the quantum circuits used

## Installation

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

Start the service with:
```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at http://localhost:8000

## API Endpoints

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
    "measurement_counts": {"0": 500, "1": 500},
    "explanation": "This quantum circuit places a qubit in superposition..."
  }
  ```

## Testing the Service

You can test the service using the included client script:
```bash
python client.py
```

This will test all available endpoints and display the results.

## Quantum Theory Background

The random number generation in this service uses the fundamental quantum principle of superposition. When a qubit is placed in superposition using a Hadamard gate, it has an equal probability of being measured as either 0 or 1. This measurement process is truly random according to the laws of quantum mechanics, not just pseudorandom like classical algorithms.

## Docker Support

The service can be run in a Docker container using the provided Dockerfile:
```bash
docker build -t quantum-service -f ../../docker/quantum-service.Dockerfile ../..
docker run -p 8000:8000 quantum-service
```

## Integration with Other Services

This service is designed to integrate with the other microservices in the QuPot platform:
- The API Gateway forwards requests to this service
- The Lottery Service uses this service to generate random numbers for draws