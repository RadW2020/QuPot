// Basic quantum interface definition
export interface QuantumRequest {
  id: string;
  type: "random" | "entanglement";
  parameters: Record<string, any>;
  status: "pending" | "processing" | "completed" | "failed";
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}
