import httpx

def check_api(port=8001):
    try:
        # Check health endpoint
        health_url = f"http://localhost:{port}/health"
        health_response = httpx.get(health_url)
        print(f"Health endpoint ({health_url}): {health_response.status_code}")
        print(f"Response: {health_response.json()}")
        
        # Check API docs
        docs_url = f"http://localhost:{port}/docs"
        docs_response = httpx.get(docs_url)
        print(f"\nDocs endpoint ({docs_url}): {docs_response.status_code}")
        
        # Check root page (HTML)
        root_url = f"http://localhost:{port}/"
        root_response = httpx.get(root_url)
        print(f"\nRoot endpoint ({root_url}): {root_response.status_code}")
        print(f"Content type: {root_response.headers.get('content-type')}")
        print(f"Content length: {len(root_response.text)} bytes")
        
        # Check random number API
        random_url = f"http://localhost:{port}/api/v1/random"
        payload = {"min_value": 1, "max_value": 90, "count": 6, "unique": True}
        random_response = httpx.post(random_url, json=payload)
        print(f"\nRandom endpoint ({random_url}): {random_response.status_code}")
        if random_response.status_code == 200:
            print(f"Response: {random_response.json()}")
        
        # Check quantum circuit info
        circuit_url = f"http://localhost:{port}/api/v1/quantum-circuit"
        circuit_response = httpx.get(circuit_url)
        print(f"\nCircuit info endpoint ({circuit_url}): {circuit_response.status_code}")
        if circuit_response.status_code == 200:
            print(f"Response: {circuit_response.json()}")
    except Exception as e:
        print(f"Error checking API: {e}")

if __name__ == "__main__":
    print("Checking API on port 8001...")
    check_api(8001)