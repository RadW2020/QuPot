import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ConfirmPasswordChangeDto {
  @ApiProperty({
    example: "abc123...",
    description: "Token received via email",
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: "newSecurePassword123",
    description: "New password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
