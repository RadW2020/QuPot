import httpx
import time
import json

def test_random_number_api():
    """Test the random number API endpoint."""
    url = "http://localhost:8000/api/v1/random"
    payload = {
        "min_value": 1,
        "max_value": 90,
        "count": 6,
        "unique": True
    }
    
    try:
        print(f"Calling POST {url} with payload: {payload}")
        response = httpx.post(url, json=payload)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\nSuccessful API response:")
            print(f"Numbers: {result['numbers']}")
            print(f"Source: {result['source']}")
            print(f"Request ID: {result['request_id']}")
            print(f"Timestamp: {result['timestamp']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to API: {e}")

def test_quantum_circuit_info():
    """Test the quantum circuit info endpoint."""
    url = "http://localhost:8000/api/v1/quantum-circuit"
    
    try:
        print(f"\nCalling GET {url}")
        response = httpx.get(url)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\nSuccessful API response:")
            print(f"Circuit description: {result['circuit_description']}")
            print(f"Circuit qubits: {result['circuit_qubits']}")
            print(f"Circuit depth: {result['circuit_depth']}")
            print(f"Measurement counts: {result['measurement_counts']}")
            print(f"Explanation: {result['explanation']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to API: {e}")

def view_api_docs():
    """Get the OpenAPI schema and print available routes."""
    url = "http://localhost:8000/openapi.json"
    
    try:
        print(f"\nCalling GET {url}")
        response = httpx.get(url)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            schema = response.json()
            routes = list(schema['paths'].keys())
            print("\nAvailable API Routes:")
            for route in routes:
                methods = list(schema['paths'][route].keys())
                for method in methods:
                    print(f"{method.upper()} {route}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to API: {e}")

if __name__ == "__main__":
    print("Testing the Quantum Random Number Generator API...")
    print("="*60)
    
    # First check available routes
    view_api_docs()
    
    # Test random number generation
    test_random_number_api()
    
    # Test quantum circuit info
    test_quantum_circuit_info()