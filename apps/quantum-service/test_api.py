import httpx
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
        response = httpx.post(url, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("Successful API response:")
            print(f"Status code: {response.status_code}")
            print(f"Numbers: {result['numbers']}")
            print(f"Source: {result['source']}")
            print(f"Request ID: {result['request_id']}")
            print(f"Timestamp: {result['timestamp']}")
            return True
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error connecting to API: {e}")
        return False

if __name__ == "__main__":
    print("Testing the Quantum Random Number Generator API...")
    # Make sure the server is running before executing this script
    test_random_number_api()