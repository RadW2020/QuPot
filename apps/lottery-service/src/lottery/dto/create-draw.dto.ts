import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDrawDto {
  @ApiProperty({ description: "Draw name", minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: "Draw description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Draw start date" })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: "Draw end date" })
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional({ description: "Initial draw status" })
  @IsOptional()
  @IsString()
  status?: string;
}
