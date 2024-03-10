import pytest

def test_health_endpoint(client):
    """Test para verificar que el endpoint de salud funciona correctamente."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "quantum-random-number-generator"
    } 