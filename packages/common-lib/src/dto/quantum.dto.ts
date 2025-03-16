// Basic quantum DTOs
export class CreateQuantumRequestDto {
  type: "random" | "entanglement";
  parameters: Record<string, any>;
}

export class UpdateQuantumRequestDto {
  status?: "pending" | "processing" | "completed" | "failed";
  result?: any;
}
