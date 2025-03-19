from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os
from pydantic import BaseModel
import random
from typing import Dict, List, Optional
import uvicorn
import datetime
import uuid

# Updated Qiskit imports
from qiskit import QuantumCircuit
from qiskit.primitives import BackendSampler
from qiskit_aer import AerSimulator

app = FastAPI(
    title="Quantum Random Number Generator API",
    description="API for generating quantum random numbers for lottery applications",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
script_dir = os.path.dirname(os.path.realpath(__file__))
static_dir = os.path.join(script_dir, "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

class RandomNumberRequest(BaseModel):
    min_value: int = 1
    max_value: int = 100
    count: int = 1
    unique: bool = True

class RandomNumberResponse(BaseModel):
    numbers: List[int]
    source: str = "quantum_simulator"
    timestamp: str
    request_id: str

# Initialize the simulator and sampler once
simulator = AerSimulator()
sampler = BackendSampler(backend=simulator)

def generate_quantum_random_bit():
    """Generate a single random bit using a quantum circuit."""
    # Create a quantum circuit with 1 qubit
    qc = QuantumCircuit(1, 1)
    
    # Put the qubit in superposition
    qc.h(0)
    
    # Measure the qubit
    qc.measure(0, 0)
    
    # Execute the circuit using the sampler
    job = sampler.run(circuits=[qc], shots=1)
    result = job.result()
    counts = result.quasi_dists[0]
    
    # Get the single measurement result (0 or 1)
    measurement = next(iter(counts.keys()))
    
    # Return the measured bit
    return measurement

def generate_quantum_random_number(min_value, max_value):
    """Generate a random number in the range [min_value, max_value] using quantum randomness."""
    range_size = max_value - min_value + 1
    
    # Determine how many bits we need
    bits_needed = (range_size - 1).bit_length()
    
    # Generate the required number of quantum random bits
    value = 0
    for i in range(bits_needed):
        bit = generate_quantum_random_bit()
        value = (value << 1) | bit
    
    # Ensure the value is within the desired range
    value = min_value + (value % range_size)
    return value

@app.get("/", tags=["Documentation"], response_class=HTMLResponse)
async def root():
    with open(os.path.join(static_dir, "index.html"), "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": "quantum-random-number-generator"}

@app.post("/api/v1/random", response_model=RandomNumberResponse, tags=["Random Numbers"])
async def generate_random_numbers(request: RandomNumberRequest):
    """
    Generate quantum random numbers within the specified range.
    
    This uses Qiskit's quantum simulator to generate random numbers based on quantum measurements.
    """
    # Validate request
    if request.min_value >= request.max_value:
        raise HTTPException(status_code=400, detail="min_value must be less than max_value")
    
    if request.count <= 0:
        raise HTTPException(status_code=400, detail="count must be positive")
    
    if request.unique and request.count > (request.max_value - request.min_value + 1):
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot generate {request.count} unique numbers in range {request.min_value}-{request.max_value}"
        )
    
    # Generate random numbers using quantum circuit
    if request.unique:
        # For unique numbers, we need to keep track of generated values
        numbers = []
        attempts = 0
        max_attempts = request.count * 10  # Limit attempts to avoid infinite loops
        
        while len(numbers) < request.count and attempts < max_attempts:
            new_number = generate_quantum_random_number(request.min_value, request.max_value)
            if new_number not in numbers:
                numbers.append(new_number)
            attempts += 1
            
        if len(numbers) < request.count:
            # If we couldn't generate enough unique numbers, fall back to classical random
            existing_set = set(numbers)
            remaining_numbers = [n for n in range(request.min_value, request.max_value + 1) 
                                if n not in existing_set]
            additional_numbers = random.sample(remaining_numbers, request.count - len(numbers))
            numbers.extend(additional_numbers)
    else:
        # For non-unique numbers, just generate the requested count
        numbers = [generate_quantum_random_number(request.min_value, request.max_value) 
                  for _ in range(request.count)]
    
    return RandomNumberResponse(
        numbers=numbers,
        source="quantum_simulator",
        timestamp=datetime.datetime.now().isoformat(),
        request_id=str(uuid.uuid4())
    )

@app.get("/api/v1/quantum-circuit", tags=["Visualization"])
async def get_quantum_circuit_info():
    """Returns information about the quantum circuit used for random number generation."""
    # Create a quantum circuit with 1 qubit
    qc = QuantumCircuit(1, 1)
    
    # Put the qubit in superposition
    qc.h(0)
    
    # Measure the qubit
    qc.measure(0, 0)
    
    # Execute the circuit with multiple shots to demonstrate the distribution
    job = sampler.run(circuits=[qc], shots=1000)
    result = job.result()
    counts = result.quasi_dists[0]
    
    # Format counts for the response
    measurement_counts = {"0": 0, "1": 0}
    for outcome, probability in counts.items():
        measurement_counts[str(outcome)] = int(probability * 1000)
    
    # Return information about the circuit and its results
    return {
        "circuit_description": "Hadamard gate followed by measurement",
        "circuit_qubits": 1,
        "circuit_depth": 2,
        "measurement_counts": measurement_counts,
        "explanation": "This quantum circuit places a qubit in superposition using a Hadamard gate, "
                     "creating an equal probability of measuring 0 or 1. The measurement then "
                     "collapses the superposition, providing a truly random bit."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)