// Basic lottery interface definition
export interface Lottery {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed";
  participants: string[];
  winner?: string;
}
