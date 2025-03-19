export enum DrawStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Draw {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: DrawStatus;
  winningNumbers?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DrawResult {
  drawId: string;
  winningNumbers: number[];
  timestamp: Date;
  quantumSource: boolean;
}
