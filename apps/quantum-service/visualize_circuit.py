from qiskit import QuantumCircuit
import matplotlib.pyplot as plt
from qiskit.visualization import plot_histogram
from qiskit_aer import Aer
from qiskit.primitives import Sampler

# Create a quantum circuit for random bit generation
def create_random_bit_circuit():
    # Create a quantum circuit with 1 qubit
    qc = QuantumCircuit(1, 1)
    
    # Put the qubit in superposition
    qc.h(0)
    
    # Measure the qubit
    qc.measure(0, 0)
    
    return qc

# Create a circuit for generating multiple random bits
def create_multi_bit_circuit(num_bits=6):
    # Create a quantum circuit with num_bits qubits
    qc = QuantumCircuit(num_bits, num_bits)
    
    # Put all qubits in superposition
    for i in range(num_bits):
        qc.h(i)
    
    # Measure all qubits
    qc.measure(range(num_bits), range(num_bits))
    
    return qc

def main():
    # Create the single bit circuit
    single_bit_circuit = create_random_bit_circuit()
    
    # Draw the circuit
    circuit_diagram = single_bit_circuit.draw(output='mpl')
    plt.title('Quantum Circuit for Random Bit Generation')
    plt.tight_layout()
    plt.savefig('quantum_circuit_single_bit.png')
    plt.close()
    
    # Simulate the circuit and get results
    simulator = Aer.get_backend('qasm_simulator')
    sampler = Sampler()
    result = sampler.run(single_bit_circuit, shots=1000).result()
    
    # Convert result to format for histogram
    counts = {}
    for outcome, probability in result.quasi_dists[0].items():
        counts[str(outcome)] = int(probability * 1000)
    
    # Plot the distribution
    plt.figure(figsize=(8, 6))
    plt.bar(counts.keys(), counts.values())
    plt.title('Measurement Results for 1000 Shots')
    plt.xlabel('Measurement Outcome')
    plt.ylabel('Count')
    plt.grid(axis='y', alpha=0.3)
    plt.savefig('quantum_distribution_single_bit.png')
    plt.close()
    
    # Create a multi-bit circuit
    multi_bit_circuit = create_multi_bit_circuit(6)
    
    # Draw the circuit
    circuit_diagram = multi_bit_circuit.draw(output='mpl')
    plt.title('Quantum Circuit for 6-Bit Random Number Generation')
    plt.tight_layout()
    plt.savefig('quantum_circuit_multi_bit.png')
    plt.close()
    
    print("Circuit visualizations saved as:")
    print("- quantum_circuit_single_bit.png")
    print("- quantum_distribution_single_bit.png")
    print("- quantum_circuit_multi_bit.png")
    
    print("\nThese images show how quantum circuits generate true randomness through quantum superposition.")
    
if __name__ == "__main__":
    main()