import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  MinLength,
} from "class-validator";

export class CreateDrawDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  status?: string;
}
