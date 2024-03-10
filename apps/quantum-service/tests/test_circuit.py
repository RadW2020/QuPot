import pytest

def test_quantum_circuit_info(client):
    """Test para verificar la información del circuito cuántico."""
    response = client.get("/api/v1/quantum-circuit")
    assert response.status_code == 200
    data = response.json()
    
    # Verificar estructura de la respuesta
    assert "circuit_description" in data
    assert "circuit_qubits" in data
    assert "circuit_depth" in data
    assert "measurement_counts" in data
    assert "explanation" in data
    
    # Verificar valores específicos
    assert data["circuit_qubits"] == 1
    assert data["circuit_depth"] == 2
    assert "0" in data["measurement_counts"]
    assert "1" in data["measurement_counts"]
    
    # Verificar que los conteos suman 1000
    total_counts = sum(data["measurement_counts"].values())
    assert total_counts == 1000 