import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ConfirmPasswordChangeDto {
  @ApiProperty({
    description: "Token de cambio de contraseña",
    example: "abc123...",
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: "Nueva contraseña",
    example: "nuevaContraseña123",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
