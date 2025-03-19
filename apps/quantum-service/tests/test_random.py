import pytest
from typing import List

def test_generate_random_numbers_valid_request(client, valid_random_request):
    """Test para verificar la generación de números aleatorios con una solicitud válida."""
    response = client.post("/api/v1/random", json=valid_random_request)
    assert response.status_code == 200
    data = response.json()
    
    # Verificar estructura de la respuesta
    assert "numbers" in data
    assert "source" in data
    assert "timestamp" in data
    assert "request_id" in data
    
    # Verificar contenido de los números
    numbers: List[int] = data["numbers"]
    assert len(numbers) == valid_random_request["count"]
    assert all(valid_random_request["min_value"] <= n <= valid_random_request["max_value"] for n in numbers)
    
    # Verificar que los números son únicos si se solicitó
    if valid_random_request["unique"]:
        assert len(set(numbers)) == len(numbers)

def test_generate_random_numbers_invalid_request(client, invalid_random_request):
    """Test para verificar el manejo de solicitudes inválidas."""
    response = client.post("/api/v1/random", json=invalid_random_request)
    assert response.status_code == 400
    assert "min_value must be less than max_value" in response.json()["detail"]

def test_generate_random_numbers_invalid_count(client):
    """Test para verificar el manejo de conteos inválidos."""
    invalid_request = {
        "min_value": 1,
        "max_value": 100,
        "count": 0,
        "unique": True
    }
    response = client.post("/api/v1/random", json=invalid_request)
    assert response.status_code == 400
    assert "count must be positive" in response.json()["detail"]

def test_generate_random_numbers_too_many_unique(client):
    """Test para verificar el manejo de solicitudes con demasiados números únicos."""
    invalid_request = {
        "min_value": 1,
        "max_value": 5,
        "count": 10,
        "unique": True
    }
    response = client.post("/api/v1/random", json=invalid_request)
    assert response.status_code == 400
    assert "Cannot generate" in response.json()["detail"] 