// Basic lottery DTOs
export class CreateLotteryDto {
  name: string;
  startDate: Date;
  endDate: Date;
}

export class UpdateLotteryDto {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "pending" | "active" | "completed";
  winner?: string;
}
