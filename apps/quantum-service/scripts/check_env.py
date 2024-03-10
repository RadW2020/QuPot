#!/usr/bin/env python3
"""
Environment check script for the quantum service.
This script verifies that all required packages are correctly installed
and the environment is properly set up.
"""

import sys
import importlib
import os
from pathlib import Path

# Define required packages
REQUIRED_PACKAGES = [
    "fastapi",
    "uvicorn",
    "pydantic",
    "qiskit",
    "matplotlib",
    "httpx",
]

# Check current directory
current_dir = Path(os.getcwd()).name
parent_dir = Path(os.getcwd()).parent.name

if parent_dir == "apps" and current_dir == "quantum-service":
    working_from = "quantum-service directory"
elif current_dir == "scripts" and Path(os.getcwd()).parent.name == "quantum-service":
    working_from = "scripts directory in quantum-service"
else:
    working_from = f"directory: {os.getcwd()}"

print(f"Environment Check for Quantum Service (working from {working_from})")
print("=" * 70)

# Check Python version
python_version = sys.version.split()[0]
print(f"Python version: {python_version}")

# Check if running in a virtual environment
in_venv = sys.prefix != sys.base_prefix
if in_venv:
    print("✅ Running in a virtual environment")
else:
    print("❌ Not running in a virtual environment")

# Check required packages
print("\nChecking required packages:")
all_packages_found = True

for package in REQUIRED_PACKAGES:
    try:
        module = importlib.import_module(package)
        version = getattr(module, "__version__", "Unknown")
        print(f"✅ {package}: {version}")
    except ImportError:
        print(f"❌ {package}: Not installed")
        all_packages_found = False

# Check if qiskit can access Aer simulator
print("\nChecking Qiskit integration:")
try:
    from qiskit import QuantumCircuit
    from qiskit_aer import Aer
    from qiskit.primitives import Sampler

    # Create a simple circuit
    qc = QuantumCircuit(1, 1)
    qc.h(0)
    qc.measure(0, 0)

    # Run with sampler
    sampler = Sampler()
    result = sampler.run(qc, shots=1).result()
    measurement = next(iter(result.quasi_dists[0].keys()))
    
    print(f"✅ Qiskit circuit execution successful, measured: {measurement}")
except Exception as e:
    print(f"❌ Qiskit circuit execution failed: {str(e)}")

# Check FastAPI integration
print("\nChecking FastAPI integration:")
try:
    from fastapi import FastAPI, Request
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import HTMLResponse
    
    app = FastAPI(title="Test App")
    print("✅ FastAPI initialization successful")
except Exception as e:
    print(f"❌ FastAPI initialization failed: {str(e)}")

# Summary
print("\nEnvironment Check Summary:")
if all_packages_found and in_venv:
    print("✅ Environment is properly set up")
elif not in_venv:
    print("⚠️ Not running in a virtual environment - some features may not work correctly")
else:
    print("❌ Some dependencies are missing - run 'pip install -r requirements.txt'")

print("\nTo run the service:")
print("  npm run dev          # From the quantum-service directory")
print("  npm run dev -- --filter=quantum-service  # From the root directory")