import pytest
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture
def client():
    """Fixture que proporciona un cliente de prueba para la API."""
    return TestClient(app)

@pytest.fixture
def valid_random_request():
    """Fixture que proporciona una solicitud válida para generar números aleatorios."""
    return {
        "min_value": 1,
        "max_value": 100,
        "count": 5,
        "unique": True
    }

@pytest.fixture
def invalid_random_request():
    """Fixture que proporciona una solicitud inválida para generar números aleatorios."""
    return {
        "min_value": 100,
        "max_value": 1,
        "count": 5,
        "unique": True
    } 